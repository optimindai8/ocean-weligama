const { chromium } = require("playwright");

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });

  // Mobile test (iPhone 14)
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
  });
  const mobilePage = await contextMobile.newPage();
  await mobilePage.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await mobilePage.evaluate(() => {
    localStorage.setItem("ocean_air_cookie_consent", "accepted");
  });

  await mobilePage.goto("http://localhost:5173/contact", { waitUntil: "domcontentloaded" });
  await mobilePage.waitForTimeout(1000);

  const emailCard = mobilePage.locator('text="Email Us"').locator('xpath=ancestor::a[contains(@class, "contact-bubbles-card")]');
  await emailCard.scrollIntoViewIfNeeded();
  await emailCard.click();
  await mobilePage.waitForTimeout(600);

  const screenshotPath = "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/contact_email_modal_mobile_verified.png";
  await mobilePage.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`📸 Saved mobile screenshot: ${screenshotPath}`);

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
