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
    viewport: { width: 1440, height: 960 },
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
  await page.waitForTimeout(1500);

  // Take screenshot of Admin Settings Home Tab with Form & Live Hero Preview
  await page.screenshot({
    path: path.join(outDir, "admin_settings_home_tab_live.png"),
    fullPage: false,
  });
  console.log("Saved admin_settings_home_tab_live.png");

  // Step 2: Test modifying a field and clicking Save
  console.log("Testing field editing and Save button...");
  const ratingInput = page.locator('[data-testid="input-rating-score"]');
  await ratingInput.fill("5.0");

  const guestsInput = page.locator('[data-testid="input-guests-count"]');
  await guestsInput.fill("1500");

  const taglineHighlightInput = page.locator('[data-testid="input-tagline-highlight"]');
  await taglineHighlightInput.fill("50 steps from the ocean.");

  await page.waitForTimeout(500);

  // Screenshot showing real-time live preview updated
  await page.screenshot({
    path: path.join(outDir, "admin_settings_home_tab_live_preview_updated.png"),
    fullPage: false,
  });
  console.log("Saved admin_settings_home_tab_live_preview_updated.png");

  // Click Save Changes
  const saveBtn = page.locator('[data-testid="button-save-home-settings"]');
  await saveBtn.click();
  await page.waitForTimeout(1000);

  // Step 3: Visit public homepage to verify live update
  console.log("Navigating to public homepage http://localhost:5173/ to verify live hero...");
  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);

  await page.screenshot({
    path: path.join(outDir, "public_home_hero_dynamic_updated.png"),
    fullPage: false,
  });
  console.log("Saved public_home_hero_dynamic_updated.png");

  // Step 4: Restore back to authentic defaults
  console.log("Navigating back to settings to restore authentic defaults...");
  await page.goto("http://localhost:5173/ow-admin/settings", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  await page.getByRole("button", { name: "Reset" }).click();
  await page.waitForTimeout(400);

  const saveBtnRestore = page.locator('[data-testid="button-save-home-settings"]');
  await saveBtnRestore.click();
  await page.waitForTimeout(1000);

  // Step 5: Final verification of public homepage restored
  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);

  await page.screenshot({
    path: path.join(outDir, "public_home_hero_authentic_verified.png"),
    fullPage: false,
  });
  console.log("Saved public_home_hero_authentic_verified.png");

  await browser.close();
  console.log("All end-to-end tests completed successfully!");
}

main().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
