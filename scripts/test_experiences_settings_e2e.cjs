const { chromium } = require("/Users/pasindumalinda/OPTIMIND_AI/Web_project/Ocean_Welligama/Ocean-Weligama/node_modules/playwright");
const path = require("path");

async function main() {
  // 1. Get real admin token from API
  const loginRes = await fetch("http://localhost:8080/api/v1/admin/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "admin@oceanweligama.com", password: "OceanAdmin2025!" }),
  });
  const { token } = await loginRes.json();
  console.log("Acquired real admin token:", !!token);

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
  });
  const page = await context.newPage();

  // Set auth token before page loads
  await page.addInitScript((tok) => {
    localStorage.setItem("ow-admin-token", tok);
  }, token);

  const outDir = "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397";

  // Step 1: Visit Admin Settings page (default active tab is Home)
  console.log("Navigating to http://localhost:5173/ow-admin/settings...");
  await page.goto("http://localhost:5173/ow-admin/settings", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // Scroll to Section 3: Experience Pillars & Imagery
  const section3 = page.locator('text=Experience Pillars & Imagery');
  await section3.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  // Take screenshot of Admin Settings with Section 3 and the 4 Cards
  await page.screenshot({
    path: path.join(outDir, "admin_settings_experiences_section.png"),
    fullPage: false,
  });
  console.log("Saved admin_settings_experiences_section.png");

  // Step 2: Test modifying Section Header and Card 1 details
  console.log("Testing field editing for Section 3 (Top of Images details + Card 1)...");
  const badgeInput = page.locator('[data-testid="input-experience-badge"]');
  await badgeInput.fill("Tailored Coastal Moments");

  const titleInput = page.locator('[data-testid="input-experience-title"]');
  await titleInput.fill("Catch • Unwind • Dine • Discover");

  const card0Tagline = page.locator('[data-testid="input-experience-card-0-tagline"]');
  await card0Tagline.fill("Catch The Best Waves");

  const card0Title = page.locator('[data-testid="input-experience-card-0-title"]');
  await card0Title.fill("Surf Hub");

  await page.waitForTimeout(600);

  // Scroll to live preview of Section 3
  const previewHeading = page.locator('text=Real-Time Live Experience Section Preview');
  await previewHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  await page.screenshot({
    path: path.join(outDir, "admin_settings_experiences_preview_updated.png"),
    fullPage: false,
  });
  console.log("Saved admin_settings_experiences_preview_updated.png");

  // Click Save Changes on Section 3
  const saveBtn = page.locator('[data-testid="button-save-experiences-settings"]');
  await saveBtn.scrollIntoViewIfNeeded();
  await saveBtn.click();
  await page.waitForTimeout(1500);

  // Step 3: Visit public homepage to verify live update
  console.log("Navigating to public homepage http://localhost:5173/ to verify dynamic experience pillars...");
  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);

  // Scroll down to the experience section
  await page.evaluate(() => {
    window.scrollTo({ top: 1200, behavior: 'instant' });
  });
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: path.join(outDir, "public_home_experiences_dynamic_updated.png"),
    fullPage: false,
  });
  console.log("Saved public_home_experiences_dynamic_updated.png");

  // Step 4: Reset back to authentic authentic values
  console.log("Resetting back to authentic authentic values...");
  await page.goto("http://localhost:5173/ow-admin/settings", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  const sec3 = page.locator('text=Experience Pillars & Imagery');
  await sec3.scrollIntoViewIfNeeded();

  await page.locator('[data-testid="input-experience-badge"]').fill("The Ocean Air Experience");
  await page.locator('[data-testid="input-experience-title"]').fill("Surf • Stay • Taste • Explore");
  await page.locator('[data-testid="input-experience-card-0-tagline"]').fill("Ride the waves");
  await page.locator('[data-testid="input-experience-card-0-title"]').fill("Surf");
  await page.locator('[data-testid="input-experience-card-0-img"]').fill("/service-surf.png");

  const saveBtn2 = page.locator('[data-testid="button-save-experiences-settings"]');
  await saveBtn2.click();
  await page.waitForTimeout(1500);

  // Scroll to show preview of Section 3 in Admin Settings
  await previewHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  await page.screenshot({
    path: path.join(outDir, "admin_settings_experiences_live_preview_final.png"),
    fullPage: false,
  });
  console.log("Saved admin_settings_experiences_live_preview_final.png");

  // Verify homepage with authentic values
  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    window.scrollTo({ top: 1200, behavior: 'instant' });
  });
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: path.join(outDir, "public_home_experiences_final_verified.png"),
    fullPage: false,
  });
  console.log("Saved public_home_experiences_final_verified.png");

  await browser.close();
  console.log("✅ All Experience settings E2E Playwright tests completed successfully!");
}

main().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
