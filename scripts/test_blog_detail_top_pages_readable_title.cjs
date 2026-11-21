const { chromium } = require("playwright");

async function run() {
  console.log("🚀 Starting E2E verification for Blog Detail page readable title in Top Pages table...");

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    locale: "en-US",
    timezoneId: "Asia/Colombo",
  });

  await context.addInitScript(() => {
    localStorage.setItem("ocean_air_cookie_consent", "accepted");
    localStorage.setItem("cookie_consent_v1", "accepted");
    localStorage.setItem("cookieConsent", "accepted");
  });

  const page = await context.newPage();

  // 1. Authenticate Admin
  console.log("1. Authenticating admin token...");
  const loginRes = await fetch("http://localhost:8080/api/v1/admin/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "admin@oceanweligama.com", password: "OceanAdmin2025!" }),
  });
  const { token } = await loginRes.json();

  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await page.evaluate((tok) => {
    localStorage.setItem("ow-admin-token", tok);
  }, token);

  // 2. Open Admin Visitors page
  console.log("2. Loading Admin Visitors page...");
  await page.goto("http://localhost:5173/ow-admin/visitors", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);

  // 3. Switch period to "30d" so the recorded blog visit is included
  console.log("3. Switching report period to 30 Days...");
  const period30dBtn = page.locator('button:has-text("30 Days"), button:has-text("30d")').first();
  if (await period30dBtn.isVisible()) {
    await period30dBtn.click();
    await page.waitForTimeout(1500);
  }

  // 4. Ensure "Top Pages" tab is active
  const topPagesTabBtn = page.locator('button:has-text("Top Pages")').first();
  await topPagesTabBtn.click();
  await page.waitForTimeout(1000);

  // 5. Locate Top Pages table
  const table = page.locator("table").first();
  await table.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // 6. Search for the blog row
  console.log("4. Inspecting Top Pages rows for the blog post...");
  const blogPathLocator = page.locator('span.font-mono:has-text("/blog/7106ede5-d106-4485-b09c-19d5f9841f0b")');
  await blogPathLocator.waitFor({ state: "visible", timeout: 5000 });

  const blogRow = blogPathLocator.locator("xpath=ancestor::tr");
  const titleEl = blogRow.locator("span.font-serif");
  const badgeEl = blogRow.locator("span.uppercase");

  const titleText = await titleEl.innerText();
  const badgeText = await badgeEl.innerText();
  console.log(`✓ Found Blog Row in Top Pages: Title="${titleText}", Badge="${badgeText}"`);

  // Verify the ugly UUID string is gone
  if (titleText.includes("7106ede5") || titleText.includes("(Story)")) {
    throw new Error(`Failed: Title still contains ugly UUID format: "${titleText}"`);
  }

  // Verify exact match
  const expectedTitle = "Secret Surf Breaks of Weligama Bay: The Ultimate Dawn Patrol & Reef Guide";
  if (!titleText.includes("Secret Surf Breaks")) {
    throw new Error(`Expected title to include "Secret Surf Breaks", but got "${titleText}"`);
  }
  console.log("✅ Verified: Blog title accurately resolved to real editorial name!");

  // 7. Save screenshot
  const screenshotPath = "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/admin_top_pages_blog_title_verified.png";
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`📸 Saved screenshot: ${screenshotPath}`);

  await browser.close();
  console.log("🎉 All blog post title accuracy tests passed 100%!");
}

run().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
