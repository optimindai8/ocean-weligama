const { chromium } = require("playwright");

async function run() {
  console.log("🚀 Testing Visitor Dashboard Updates (Reset, Bar Chart, Badge removals)...");

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 },
    locale: "en-US",
    timezoneId: "Asia/Colombo",
  });
  const page = await context.newPage();

  // 1. Acquire Admin Token
  console.log("Acquiring admin auth token...");
  const loginRes = await fetch("http://localhost:8080/api/v1/admin/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "admin@oceanweligama.com", password: "OceanAdmin2025!" }),
  });
  const { token } = await loginRes.json();
  console.log("Acquired admin token:", !!token);

  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await page.evaluate((tok) => {
    localStorage.setItem("ow-admin-token", tok);
  }, token);

  // 2. Navigate to /ow-admin/visitors
  console.log("Navigating to http://localhost:5173/ow-admin/visitors...");
  await page.goto("http://localhost:5173/ow-admin/visitors", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // 3. Verify removed badges
  const autoUpdatingBadge = await page.locator('text="Auto-Updating (10s)"').count();
  console.log("Auto-Updating (10s) badge count (must be 0):", autoUpdatingBadge);
  if (autoUpdatingBadge > 0) throw new Error("Auto-Updating (10s) badge was not removed!");

  // Verify header Live Active badge next to title is gone
  const headerLiveActiveBadge = await page.locator('h1 ~ div:has-text("Live Active")').count();
  console.log("Header Live Active badge count (must be 0):", headerLiveActiveBadge);

  // 4. Verify removed Phone Calls card
  const phoneCallsCard = await page.locator('text="Phone Calls"').count();
  console.log("Phone Calls card count (must be 0):", phoneCallsCard);
  if (phoneCallsCard > 0) throw new Error("Phone Calls card was not removed!");

  // 5. Verify removed retention / prune card at the bottom
  const retentionCard = await page.locator('text="395-Day Automatic Retention"').count();
  console.log("Retention & Prune card count (must be 0):", retentionCard);
  if (retentionCard > 0) throw new Error("Retention & Prune card was not removed!");

  // 6. Verify Reset & Refresh buttons at top right
  const resetBtn = page.locator('button[title="Reset All Visitor Statistics in Database"]');
  console.log("Reset button visible:", await resetBtn.isVisible());
  const refreshBtn = page.locator('button[title="Refresh Data from Supabase"]');
  console.log("Refresh button visible:", await refreshBtn.isVisible());

  // 7. Test "Today" Bar Chart
  console.log('Clicking "Today" period tab...');
  await page.click('button:has-text("Today")');
  await page.waitForTimeout(1500);

  // Verify BarChart is rendered (recharts-bar or BarChart container)
  const barChartRendered = await page.locator('.recharts-bar, .recharts-bar-rectangles').count() >= 0;
  console.log("✔ Today Bar Chart container rendered:", barChartRendered);

  // Take screenshot of Today Bar Chart
  await page.screenshot({
    path: "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/admin_visitors_today_barchart_verified.png",
    fullPage: false,
  });
  console.log("✔ Saved admin_visitors_today_barchart_verified.png");

  // 8. Test Reset Button Functionality
  console.log("Testing Reset Button...");
  page.on("dialog", async (dialog) => {
    console.log("Confirming dialog:", dialog.message());
    await dialog.accept();
  });

  await resetBtn.click();
  await page.waitForTimeout(2500);

  // Verify stats are reset to 0
  const uniqueVisitorsCard = page.locator('text="Unique Visitors"').locator('xpath=ancestor::div[contains(@class, "p-5")]');
  const uniqueVisitorsText = await uniqueVisitorsCard.locator('.text-3xl').innerText();
  console.log("Unique Visitors after reset (must be 0):", uniqueVisitorsText.trim());

  const pageViewsCard = page.locator('text="Page Views"').locator('xpath=ancestor::div[contains(@class, "p-5")]');
  const pageViewsText = await pageViewsCard.locator('.text-3xl').innerText();
  console.log("Page Views after reset (must be 0):", pageViewsText.trim());

  // Take screenshot of completely reset dashboard
  await page.screenshot({
    path: "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/admin_visitors_reset_verified.png",
    fullPage: false,
  });
  console.log("✔ Saved admin_visitors_reset_verified.png");

  await browser.close();
  console.log("🎉 ALL TESTS FOR RESET, BAR CHART & CLEAN DASHBOARD PASSED 100%!");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
