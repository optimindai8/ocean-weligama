const { chromium } = require("playwright");

async function run() {
  console.log("🚀 Starting Footer Email Interaction Test...");
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 },
    locale: "en-US",
  });

  // Pre-seed cookie consent in initial scripts so overlay never renders
  await context.addInitScript(() => {
    localStorage.setItem("ocean_air_cookie_consent", "accepted");
    localStorage.setItem("cookie_consent_v1", "accepted");
    localStorage.setItem("cookieConsent", "accepted");
  });

  const page = await context.newPage();

  console.log("1. Navigating to http://localhost:5173/...");
  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);

  // If cookie consent overlay exists, accept it
  try {
    const consentBtn = page.locator('button:has-text("Accept All"), button:has-text("Accept")').first();
    if (await consentBtn.isVisible({ timeout: 1500 })) {
      console.log("Dismissing cookie overlay...");
      await consentBtn.click();
      await page.waitForTimeout(500);
    }
  } catch (e) {
    // No overlay
  }

  // Scroll down to the footer
  console.log("2. Scrolling to footer...");
  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  // Locate the email button in footer
  console.log("3. Locating email button in footer...");
  const emailBtn = footer.locator('button:has-text("pelanawhitehouse@gmail.com")');
  await emailBtn.waitFor({ state: "visible", timeout: 5000 });
  await emailBtn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  console.log("4. Clicking footer email button...");
  await emailBtn.click();
  await page.waitForTimeout(600);

  // Verify modal is visible
  console.log("5. Verifying luxury Email Concierge modal is open...");
  const modalTitle = page.locator('h3:has-text("Send an Email")');
  await modalTitle.waitFor({ state: "visible", timeout: 5000 });
  console.log("✅ 'Send an Email' modal title is visible!");

  // Verify recipient address inside modal
  const recipient = page.locator('div.font-mono:has-text("pelanawhitehouse@gmail.com")');
  await recipient.waitFor({ state: "visible", timeout: 3000 });
  console.log("✅ Recipient email address displayed correctly inside modal!");

  // Verify Open in Gmail button and its link inside modal
  const gmailLink = page.locator('a:has-text("Open in Gmail")');
  await gmailLink.waitFor({ state: "visible", timeout: 3000 });
  const gmailHref = await gmailLink.getAttribute("href");
  console.log(`✅ 'Open in Gmail' link verified: ${gmailHref}`);
  if (!gmailHref || !gmailHref.includes("mail.google.com")) {
    throw new Error("Invalid Gmail compose link: " + gmailHref);
  }

  // Verify Copy button inside modal
  const copyBtn = page.locator('button:has-text("Copy")');
  await copyBtn.waitFor({ state: "visible", timeout: 3000 });
  console.log("✅ 'Copy' button is present!");

  // Capture screenshot of the modal
  const screenshotPath = "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/admin_footer_email_modal_verified.png";
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`📸 Saved screenshot: ${screenshotPath}`);

  // Test copy interaction
  await copyBtn.click();
  await page.waitForTimeout(400);
  const copiedBadge = page.locator('text="Copied!"');
  await copiedBadge.waitFor({ state: "visible", timeout: 3000 });
  console.log("✅ 'Copied!' tactile feedback verified!");

  await browser.close();
  console.log("🎉 All footer email modal tests passed 100%!");
}

run().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
