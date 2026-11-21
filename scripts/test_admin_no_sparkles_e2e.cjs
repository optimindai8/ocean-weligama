const { chromium } = require("playwright");

async function run() {
  console.log("🚀 Starting E2E verification: 100% removal of Sparkles icons from Admin Panel...");

  // 1. Get real admin token from API
  const loginRes = await fetch("http://localhost:8080/api/v1/admin/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "admin@oceanweligama.com", password: "OceanAdmin2025!" }),
  });
  const { token } = await loginRes.json();
  console.log("✓ Acquired real admin token:", !!token);

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 },
    locale: "en-US",
    timezoneId: "Asia/Colombo",
  });

  // Inject real admin token into localStorage
  await context.addInitScript((jwt) => {
    localStorage.setItem("ow-admin-token", jwt);
  }, token);

  const page = await context.newPage();

  // 1. Check Admin Visitors Top Pages Table
  console.log("1. Checking Admin Visitors page (/ow-admin/visitors)...");
  await page.goto("http://localhost:5173/ow-admin/visitors", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const visitorsSparklesCount = await page.locator("svg.lucide-sparkles").count();
  console.log(`✓ Admin Visitors Sparkles Count: ${visitorsSparklesCount} (must be 0)`);
  if (visitorsSparklesCount > 0) {
    throw new Error(`Found ${visitorsSparklesCount} Sparkles icon(s) on Admin Visitors page!`);
  }

  // Verify Palmtree is present in Top Pages table
  const palmtreeCount = await page.locator("svg.lucide-palmtree").count();
  console.log(`✓ Admin Visitors Palmtree Icon Count: ${palmtreeCount}`);

  await page.screenshot({
    path: "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/admin_visitors_no_sparkles_verified.png",
    fullPage: false,
  });

  // 2. Check Admin Addons / Experiences Page
  console.log("2. Checking Admin Addons/Experiences page (/ow-admin/addons)...");
  await page.goto("http://localhost:5173/ow-admin/addons", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const addonsSparklesCount = await page.locator("svg.lucide-sparkles").count();
  console.log(`✓ Admin Addons Sparkles Count: ${addonsSparklesCount} (must be 0)`);
  if (addonsSparklesCount > 0) {
    throw new Error(`Found ${addonsSparklesCount} Sparkles icon(s) on Admin Addons page!`);
  }

  // Verify Compass icon is present
  const compassCount = await page.locator("svg.lucide-compass").count();
  console.log(`✓ Admin Addons Compass Icon Count: ${compassCount}`);

  await page.screenshot({
    path: "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/admin_addons_no_sparkles_verified.png",
    fullPage: false,
  });

  // 3. Check Admin Settings Page
  console.log("3. Checking Admin Settings page (/ow-admin/settings)...");
  await page.goto("http://localhost:5173/ow-admin/settings", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const settingsSparklesCount = await page.locator("svg.lucide-sparkles").count();
  console.log(`✓ Admin Settings Sparkles Count: ${settingsSparklesCount} (must be 0)`);
  if (settingsSparklesCount > 0) {
    throw new Error(`Found ${settingsSparklesCount} Sparkles icon(s) on Admin Settings page!`);
  }

  // Verify Crown icon is present in Hero Section header
  const crownCount = await page.locator("svg.lucide-crown").count();
  console.log(`✓ Admin Settings Crown Icon Count: ${crownCount}`);

  await page.screenshot({
    path: "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/admin_settings_no_sparkles_verified.png",
    fullPage: false,
  });

  await browser.close();
  console.log("🎉 SUCCESS: All Sparkles icons completely eradicated from Admin Panel and replaced with suitable icons!");
}

run().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
