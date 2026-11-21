const { chromium } = require("playwright");

async function run() {
  console.log("🚀 Starting Contact Page Email Interaction Test...");
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 },
    locale: "en-US",
  });
  const page = await context.newPage();

  // Set cookie consent so overlay does not intercept
  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.setItem("ocean_air_cookie_consent", "accepted");
  });

  console.log("1. Navigating to http://localhost:5173/contact...");
  await page.goto("http://localhost:5173/contact", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // 2. Find and click the Email card
  console.log("2. Locating 'Email Us' card...");
  const emailCard = page.locator('text="Email Us"').locator('xpath=ancestor::a[contains(@class, "contact-bubbles-card")]');
  await emailCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  console.log("3. Clicking 'Email Us' card...");
  await emailCard.click();
  await page.waitForTimeout(600);

  // 3. Verify Email Modal is visible
  const modalTitle = page.locator('h3:has-text("Send an Email")');
  await modalTitle.waitFor({ state: "visible", timeout: 4000 });
  console.log("✅ Email modal opened successfully!");

  // Verify Gmail option
  const gmailOption = page.locator('text="Open in Gmail"');
  await gmailOption.waitFor({ state: "visible", timeout: 2000 });
  console.log("✅ 'Open in Gmail' option is present!");

  // Verify Outlook option
  const outlookOption = page.locator('text="Open in Outlook / Live"');
  await outlookOption.waitFor({ state: "visible", timeout: 2000 });
  console.log("✅ 'Open in Outlook / Live' option is present!");

  // Verify Copy Button
  const copyBtn = page.locator('button:has-text("Copy")');
  await copyBtn.waitFor({ state: "visible", timeout: 2000 });
  console.log("✅ 'Copy' button is present!");

  // Capture screenshot of the modal
  const screenshotPath = "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/contact_email_modal_verified.png";
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`📸 Saved screenshot: ${screenshotPath}`);

  // Test copy interaction
  await copyBtn.click();
  await page.waitForTimeout(300);
  const copiedBadge = page.locator('text="Copied!"');
  await copiedBadge.waitFor({ state: "visible", timeout: 2000 });
  console.log("✅ Email copied toast and badge verified!");

  await browser.close();
  console.log("🎉 All contact email tests passed 100%!");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
