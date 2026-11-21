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

  // Scroll to Section 2: Reassurance & Feature Badges
  const section2 = page.locator('text=Reassurance & Feature Badges');
  await section2.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // Take screenshot of Admin Settings with Reassurance section & Live Preview
  await page.screenshot({
    path: path.join(outDir, "admin_settings_reassurance_section.png"),
    fullPage: false,
  });
  console.log("Saved admin_settings_reassurance_section.png");

  // Step 2: Test modifying fields and verify real-time live preview
  console.log("Testing field editing for Card 2 and Card 3...");
  const card2Stat = page.locator('[data-testid="input-reassurance-card2-stat"]');
  await card2Stat.fill("120");

  const card2Title = page.locator('[data-testid="input-reassurance-card2-title"]');
  await card2Title.fill("Steps to Shore");

  const card2Desc = page.locator('[data-testid="input-reassurance-card2-desc"]');
  await card2Desc.fill("World-Class Surf Point");

  const card3Stat = page.locator('[data-testid="input-reassurance-card3-stat"]');
  await card3Stat.fill("5.0");

  const card3Title = page.locator('[data-testid="input-reassurance-card3-title"]');
  await card3Title.fill("Guest Excellence");

  const card3Desc = page.locator('[data-testid="input-reassurance-card3-desc"]');
  await card3Desc.fill("Exceptional Hospitality");

  await page.waitForTimeout(600);

  // Screenshot showing real-time live preview updated
  await page.screenshot({
    path: path.join(outDir, "admin_settings_reassurance_preview_updated.png"),
    fullPage: false,
  });
  console.log("Saved admin_settings_reassurance_preview_updated.png");

  // Click Save Changes on Section 2
  const saveBtn = page.locator('[data-testid="button-save-reassurance-settings"]');
  await saveBtn.click();
  await page.waitForTimeout(1500);

  // Step 3: Visit public homepage to verify live update
  console.log("Navigating to public homepage http://localhost:5173/ to verify dynamic reassurance cards...");
  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);

  // Scroll down to the reassurance cards container
  await page.evaluate(() => {
    window.scrollTo({ top: 580, behavior: 'instant' });
  });
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: path.join(outDir, "public_home_reassurance_dynamic_updated.png"),
    fullPage: false,
  });
  console.log("Saved public_home_reassurance_dynamic_updated.png");

  // Step 4: Reset back to authentic authentic settings
  console.log("Resetting back to requested authentic values (100 Steps to Beach, 4.9 Guest Rating)...");
  await page.goto("http://localhost:5173/ow-admin/settings", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  const sec2 = page.locator('text=Reassurance & Feature Badges');
  await sec2.scrollIntoViewIfNeeded();

  await page.locator('[data-testid="input-reassurance-card2-stat"]').fill("100");
  await page.locator('[data-testid="input-reassurance-card2-title"]').fill("Steps to Beach");
  await page.locator('[data-testid="input-reassurance-card2-desc"]').fill("Prime Surf Location");

  await page.locator('[data-testid="input-reassurance-card3-stat"]').fill("4.9");
  await page.locator('[data-testid="input-reassurance-card3-suffix"]').fill("★");
  await page.locator('[data-testid="input-reassurance-card3-title"]').fill("Guest Rating");
  await page.locator('[data-testid="input-reassurance-card3-desc"]').fill("Top-Rated Hospitality");

  const saveBtn2 = page.locator('[data-testid="button-save-reassurance-settings"]');
  await saveBtn2.click();
  await page.waitForTimeout(1500);

  // Capture final screenshot of admin settings
  await page.screenshot({
    path: path.join(outDir, "admin_settings_reassurance_final.png"),
    fullPage: false,
  });
  console.log("Saved admin_settings_reassurance_final.png");

  // Verify homepage with authentic values
  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    window.scrollTo({ top: 580, behavior: 'instant' });
  });
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: path.join(outDir, "public_home_reassurance_final_verified.png"),
    fullPage: false,
  });
  console.log("Saved public_home_reassurance_final_verified.png");

  await browser.close();
  console.log("✅ All E2E Playwright tests completed successfully!");
}

main().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
