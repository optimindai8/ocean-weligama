const { chromium } = require("/Users/pasindumalinda/OPTIMIND_AI/Web_project/Ocean_Welligama/Ocean-Weligama/node_modules/playwright");
const path = require("path");

async function main() {
  console.log("=== Starting Why Choose Us & Showcase E2E Verification ===");

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

  // Scroll to Section 4: Why Choose Us & Showcase
  const section4 = page.locator('text=Why Choose Us & Showcase');
  await section4.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  // Take screenshot of Admin Settings with Section 4
  await page.screenshot({
    path: path.join(outDir, "admin_settings_why_choose_us_section.png"),
    fullPage: false,
  });
  console.log("Saved admin_settings_why_choose_us_section.png");

  // Step 2: Test modifying Section 4 details
  console.log("Testing field editing for Section 4...");
  const badgeInput = page.locator('[data-testid="input-why-badge"]');
  await badgeInput.fill("Weligama Exclusive Sanctuary");

  const headingLeadInput = page.locator('[data-testid="input-why-heading-lead"]');
  await headingLeadInput.fill("Beyond Just A");

  const headingHighlightInput = page.locator('[data-testid="input-why-heading-highlight"]');
  await headingHighlightInput.fill("Paradise Retreat");

  const feature0Title = page.locator('[data-testid="input-why-feature-title-0"]');
  await feature0Title.fill("Steps to Private Point Break");

  const awardTagInput = page.locator('[data-testid="input-why-award-tag"]');
  await awardTagInput.fill("Michelin Selected");

  const testimonialAuthor = page.locator('[data-testid="input-why-testimonial-author"]');
  await testimonialAuthor.fill("Elena Rostova");

  await page.waitForTimeout(600);

  // Take screenshot of the live preview with modified fields
  const previewArea = page.locator('text=Real-Time Live Showcase Preview');
  await previewArea.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(outDir, "admin_settings_why_choose_us_live_preview.png"),
    fullPage: false,
  });
  console.log("Saved admin_settings_why_choose_us_live_preview.png");

  // Step 3: Save changes
  console.log("Saving changes via button-save-why-choose-us-settings...");
  const saveBtn = page.locator('[data-testid="button-save-why-choose-us-settings"]');
  await saveBtn.scrollIntoViewIfNeeded();
  await saveBtn.click();
  await page.waitForTimeout(2000);

  // Step 4: Visit public homepage to verify live dynamic display
  console.log("Visiting public homepage http://localhost:5173/ ...");
  const homePage = await context.newPage();
  await homePage.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await homePage.waitForTimeout(2000);

  const homeWhySection = homePage.locator('text=Beyond Just A');
  await homeWhySection.scrollIntoViewIfNeeded();
  await homePage.waitForTimeout(1000);

  await homePage.screenshot({
    path: path.join(outDir, "public_home_why_choose_us_dynamic_updated.png"),
    fullPage: false,
  });
  console.log("Saved public_home_why_choose_us_dynamic_updated.png");

  // Step 5: Reset to the authentic defaults requested by user and save
  console.log("Resetting to authentic defaults...");
  await page.bringToFront();
  const resetBtn = page.locator('button:has-text("Reset")').last();
  await resetBtn.scrollIntoViewIfNeeded();
  await resetBtn.click();
  await page.waitForTimeout(800);

  // Save the reset authentic values
  await saveBtn.click();
  await page.waitForTimeout(2000);

  // Take final screenshots
  await previewArea.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(outDir, "admin_settings_why_choose_us_final_verified.png"),
    fullPage: false,
  });
  console.log("Saved admin_settings_why_choose_us_final_verified.png");

  // Verify homepage with authentic details
  await homePage.bringToFront();
  await homePage.reload({ waitUntil: "domcontentloaded" });
  await homePage.waitForTimeout(2000);
  const homeAuthenticSection = homePage.locator('text=More Than Just A');
  await homeAuthenticSection.scrollIntoViewIfNeeded();
  await homePage.waitForTimeout(1000);

  await homePage.screenshot({
    path: path.join(outDir, "public_home_why_choose_us_final_verified.png"),
    fullPage: false,
  });
  console.log("Saved public_home_why_choose_us_final_verified.png");

  console.log("=== All E2E Tests for Why Choose Us Passed Successfully! ===");
  await browser.close();
}

main().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
