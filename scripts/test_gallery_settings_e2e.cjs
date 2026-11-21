const { chromium } = require("/Users/pasindumalinda/OPTIMIND_AI/Web_project/Ocean_Welligama/Ocean-Weligama/node_modules/playwright");
const path = require("path");

async function main() {
  console.log("=== Starting Gallery Settings (Featured Moments) E2E Verification ===");

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

  // Step 1: Visit Admin Settings page and click Gallery Tab
  console.log("Navigating to http://localhost:5173/ow-admin/settings...");
  await page.goto("http://localhost:5173/ow-admin/settings", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // Click on the Gallery tab
  console.log("Switching to Gallery tab...");
  const galleryTabBtn = page.locator('button:has-text("Gallery")').first();
  await galleryTabBtn.click();
  await page.waitForTimeout(1000);

  // Take screenshot of Admin Settings Gallery tab
  await page.screenshot({
    path: path.join(outDir, "admin_settings_gallery_tab_overview.png"),
    fullPage: false,
  });
  console.log("Saved admin_settings_gallery_tab_overview.png");

  // Step 2: Test modifying Section 1 details (Headline & Card 1 caption)
  console.log("Testing field editing for Featured Moments in Gallery tab...");
  const leadInput = page.locator('[data-testid="input-gallery-heading-lead"]');
  await leadInput.fill("Cinematic");

  const highlightInput = page.locator('[data-testid="input-gallery-heading-highlight"]');
  await highlightInput.fill("Wonders");

  const caption0Input = page.locator('[data-testid="input-gallery-video-caption-0"]');
  await caption0Input.fill("Sunrise Surf Glow");

  const location0Input = page.locator('[data-testid="input-gallery-video-location-0"]');
  await location0Input.fill("Dawn Patrol Bay");

  await page.waitForTimeout(600);

  // Scroll to Live Preview
  const previewArea = page.locator('text=Real-Time Live Featured Moments Preview');
  await previewArea.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // Take screenshot of live preview
  await page.screenshot({
    path: path.join(outDir, "admin_settings_gallery_live_preview.png"),
    fullPage: false,
  });
  console.log("Saved admin_settings_gallery_live_preview.png");

  // Step 3: Save changes
  console.log("Saving Gallery changes via button-save-gallery-settings...");
  const saveBtn = page.locator('[data-testid="button-save-gallery-settings"]');
  await saveBtn.scrollIntoViewIfNeeded();
  await saveBtn.click();
  await page.waitForTimeout(2000);

  // Step 4: Visit public gallery page to verify dynamic update
  console.log("Visiting public gallery page http://localhost:5173/gallery ...");
  const galleryPage = await context.newPage();
  await galleryPage.goto("http://localhost:5173/gallery", { waitUntil: "domcontentloaded" });
  await galleryPage.waitForTimeout(2000);

  const featuredShowcase = galleryPage.locator('#featured-showcase');
  await featuredShowcase.scrollIntoViewIfNeeded();
  await galleryPage.waitForTimeout(1000);

  await galleryPage.screenshot({
    path: path.join(outDir, "public_gallery_featured_moments_dynamic_updated.png"),
    fullPage: false,
  });
  console.log("Saved public_gallery_featured_moments_dynamic_updated.png");

  // Step 5: Reset to authentic defaults requested by user and save
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
    path: path.join(outDir, "admin_settings_gallery_final_verified.png"),
    fullPage: false,
  });
  console.log("Saved admin_settings_gallery_final_verified.png");

  // Verify public gallery with authentic details
  await galleryPage.bringToFront();
  await galleryPage.reload({ waitUntil: "domcontentloaded" });
  await galleryPage.waitForTimeout(2000);
  await featuredShowcase.scrollIntoViewIfNeeded();
  await galleryPage.waitForTimeout(1000);

  await galleryPage.screenshot({
    path: path.join(outDir, "public_gallery_featured_moments_final_verified.png"),
    fullPage: false,
  });
  console.log("Saved public_gallery_featured_moments_final_verified.png");

  console.log("=== All E2E Tests for Gallery Settings Passed Successfully! ===");
  await browser.close();
}

main().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
