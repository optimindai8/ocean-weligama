const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const ARTIFACT_DIR = "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397";

async function run() {
  console.log("🚀 Starting Cookie Card Popup Visual & Functional Test...");

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });

  // 1. Desktop Test
  console.log("1. Testing Desktop viewport (1440x900)...");
  const contextDesktop = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await contextDesktop.newPage();

  // Clear local storage first to simulate a brand new visitor
  await page.goto("http://localhost:5173", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.removeItem("ocean_air_cookie_consent");
    localStorage.removeItem("ow_ad_last_shown_undefined");
  });

  // Reload page to observe smooth popup appearance
  await page.goto("http://localhost:5173", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1600); // Wait for the 800ms natural entry timer

  // Locate cookie consent elements
  const overlay = page.locator('[data-testid="cookie-consent-overlay"]');
  const card = page.locator('[data-testid="cookie-consent-card"]');
  const title = page.locator('[data-testid="cookie-title"]');
  const description = page.locator('[data-testid="cookie-description"]');
  const acceptBtn = page.locator('[data-testid="cookie-accept-btn"]');
  const rejectBtn = page.locator('[data-testid="cookie-reject-btn"]');
  const closeBtn = page.locator('[data-testid="cookie-close-btn"]');

  await card.waitFor({ state: "visible", timeout: 5000 });
  console.log("✅ Cookie consent card is visible!");

  const titleText = await title.innerText();
  const descText = await description.innerText();
  console.log(`Title: "${titleText}"`);
  console.log(`Description: "${descText}"`);

  // Capture desktop screenshot
  const desktopScreenshot = path.join(ARTIFACT_DIR, "cookie_card_desktop_popup.png");
  await page.screenshot({ path: desktopScreenshot });
  console.log(`📸 Saved desktop screenshot: ${desktopScreenshot}`);

  // 2. Mobile Viewport Test (iPhone 14)
  console.log("2. Testing Mobile viewport (390x844)...");
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15"
  });
  const mobilePage = await contextMobile.newPage();
  await mobilePage.goto("http://localhost:5173?cookie_card=true", { waitUntil: "domcontentloaded" });
  await mobilePage.waitForTimeout(600);

  const mobileCard = mobilePage.locator('[data-testid="cookie-consent-card"]');
  await mobileCard.waitFor({ state: "visible", timeout: 5000 });

  const mobileScreenshot = path.join(ARTIFACT_DIR, "cookie_card_mobile_popup.png");
  await mobilePage.screenshot({ path: mobileScreenshot });
  console.log(`📸 Saved mobile screenshot: ${mobileScreenshot}`);

  // 3. Test Accept Action
  console.log("3. Testing Accept button interaction...");
  await acceptBtn.click();
  await card.waitFor({ state: "detached", timeout: 3000 });
  console.log("✅ Card detached/unmounted after Accept!");

  const savedConsent = await page.evaluate(() => localStorage.getItem("ocean_air_cookie_consent"));
  console.log(`Saved consent in localStorage: "${savedConsent}" (expected: "accepted")`);

  // 4. Test Reopening via global helper
  console.log("4. Testing Reopen via window.openCookieCard()...");
  await page.evaluate(() => window.openCookieCard());
  await card.waitFor({ state: "visible", timeout: 3000 });
  console.log("✅ Card reopened successfully!");

  // 5. Test Close X button
  console.log("5. Testing Close (X) button interaction...");
  await closeBtn.click();
  await card.waitFor({ state: "detached", timeout: 3000 });
  console.log("✅ Card detached/unmounted after Close (X)!");

  await browser.close();
  console.log("🎉 COOKIE CARD POPUP TEST COMPLETED SUCCESSFULLY!");
}

run().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
