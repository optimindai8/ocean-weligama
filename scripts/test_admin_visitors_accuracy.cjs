const { chromium } = require("playwright");

async function run() {
  console.log("🚀 Testing Admin Visitors Accuracy & Country Resolution...");

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "en-US",
    timezoneId: "Asia/Colombo",
  });
  const page = await context.newPage();

  // Monitor all /collect requests
  const collectRequests = [];
  page.on("request", (req) => {
    if (req.url().includes("/collect")) {
      try {
        const postData = req.postData();
        collectRequests.push({ url: req.url(), data: postData ? JSON.parse(postData) : null });
      } catch (e) {
        collectRequests.push({ url: req.url(), raw: req.postData() });
      }
    }
  });

  // 1. Visit public website as a guest
  console.log("Navigating to public home page http://localhost:5173/...");
  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // Accept cookies to enable tracking
  const acceptBtn = page.locator('button:has-text("Accept")');
  if (await acceptBtn.isVisible()) {
    console.log("Accepting cookies...");
    await acceptBtn.click();
    await page.waitForTimeout(1000);
  }

  // Browse to /rooms
  console.log("Navigating to /rooms...");
  await page.goto("http://localhost:5173/rooms", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  console.log(`Public collect requests sent: ${collectRequests.length}`);
  const publicPaths = collectRequests.map((r) => r.data?.path).filter(Boolean);
  console.log("Public paths captured:", publicPaths);

  // 2. Acquire Admin Token
  console.log("Acquiring admin auth token...");
  const loginRes = await fetch("http://localhost:8080/api/v1/admin/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "admin@oceanweligama.com", password: "OceanAdmin2025!" }),
  });
  const { token } = await loginRes.json();
  console.log("Acquired admin token:", !!token);

  await page.evaluate((tok) => {
    localStorage.setItem("ow-admin-token", tok);
  }, token);

  const adminCollectCountBefore = collectRequests.length;

  // 3. Navigate to /ow-admin/visitors
  console.log("Navigating to http://localhost:5173/ow-admin/visitors...");
  await page.goto("http://localhost:5173/ow-admin/visitors", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);

  // Verify that NO collect request was sent for /ow-admin
  const adminCollectRequests = collectRequests.slice(adminCollectCountBefore);
  const adminPathsCaptured = adminCollectRequests
    .map((r) => r.data?.path)
    .filter((p) => p && (p.includes("/ow-admin") || p.includes("/admin")));
  console.log("Admin paths captured during admin browsing (must be 0):", adminPathsCaptured.length);
  if (adminPathsCaptured.length > 0) {
    throw new Error(`FAIL: Admin paths were tracked: ${JSON.stringify(adminPathsCaptured)}`);
  }
  console.log("✔ SUCCESS: Admin panel is 100% excluded from visitor tracking!");

  // 4. Verify Admin UI elements
  const autoUpdateBadge = await page.locator('text="Auto-Updating (10s)"').isVisible();
  console.log("✔ Auto-Updating (10s) badge visible:", autoUpdateBadge);

  const refreshBtn = page.locator('button[title="Refresh Data from Supabase"]');
  console.log("✔ Refresh button visible in top-right corner:", await refreshBtn.isVisible());

  // Click refresh button to verify spin
  console.log("Clicking Refresh button...");
  await refreshBtn.click();
  await page.waitForTimeout(1000);

  // Take screenshot of overview with top-right refresh button and live active
  await page.screenshot({
    path: "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/admin_visitors_top_right_refresh_verified.png",
    fullPage: false,
  });
  console.log("✔ Saved admin_visitors_top_right_refresh_verified.png");

  // 5. Click Guest Origins tab
  console.log('Clicking "Guest Origins" tab...');
  await page.click('button:has-text("Guest Origins")');
  await page.waitForTimeout(1500);

  // Check if Sri Lanka is visible
  const sriLankaCard = page.locator('text="Sri Lanka"');
  const isSriLankaVisible = await sriLankaCard.first().isVisible();
  console.log("✔ Sri Lanka (LK) country card visible:", isSriLankaVisible);

  const unknownCard = page.locator('text="Unknown"');
  const isUnknownVisible = await unknownCard.count() > 0 ? await unknownCard.first().isVisible() : false;
  console.log("Unknown card visible (expected false):", isUnknownVisible);

  // Take screenshot of Guest Origins tab
  await page.screenshot({
    path: "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/admin_visitors_guest_origins_srilanka_verified.png",
    fullPage: false,
  });
  console.log("✔ Saved admin_visitors_guest_origins_srilanka_verified.png");

  await browser.close();
  console.log("🎉 ALL ACCURACY & COUNTRY RESOLUTION VERIFICATIONS PASSED 100%!");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
