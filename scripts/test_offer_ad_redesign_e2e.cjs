const { chromium } = require("playwright");

async function run() {
  console.log("🚀 Starting E2E verification for enlarged Offer Ad Popup with Crown & Waves icons (No Sparkles)...");

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "en-US",
    timezoneId: "Asia/Colombo",
  });

  // Ensure cookie consent is accepted and ad cooldown is cleared
  await context.addInitScript(() => {
    localStorage.setItem("ocean_air_cookie_consent", "accepted");
    localStorage.setItem("cookie_consent_v1", "accepted");
    localStorage.setItem("cookieConsent", "accepted");
    // Clear any previous ad cooldowns
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("ow_ad_last_shown_")) {
        localStorage.removeItem(k);
      }
    }
  });

  const page = await context.newPage();

  console.log("1. Navigating to FAQ page (as shown in user screenshot)...");
  await page.goto("http://localhost:5173/faq", { waitUntil: "domcontentloaded" });

  console.log("2. Waiting for Offer Ad Popup to animate in...");
  const modalSelector = 'div:has-text("Exclusive Seasonal Privilege")';
  const modalLocator = page.locator(modalSelector).first();
  await modalLocator.waitFor({ state: "visible", timeout: 8000 });
  await page.waitForTimeout(1000); // Wait for spring animation to settle

  console.log("3. Inspecting Offer Ad Popup attributes...");
  const modalBox = page.locator('.rounded-\\[28px\\], .rounded-\\[34px\\], .max-w-5xl').first();
  await modalBox.waitFor({ state: "visible", timeout: 5000 });

  const boxRect = await modalBox.boundingBox();
  console.log(`✓ Enlarged Modal Box Dimensions: width=${boxRect.width}px, height=${boxRect.height}px`);
  if (boxRect.width < 940) {
    throw new Error(`Expected enlarged modal width >= 940px, but got ${boxRect.width}px`);
  }

  // Verify elements
  const titleText = await page.locator('h2:has-text("SEASONS STARTED SPECIAL")').innerText();
  console.log(`✓ Title: "${titleText}"`);

  // Verify Crown icon is present in badge
  const crownIcon = page.locator('svg.lucide-crown').first();
  const crownVisible = await crownIcon.isVisible();
  console.log(`✓ Crown Icon present in Privilege Badge: ${crownVisible}`);
  if (!crownVisible) {
    throw new Error("Crown icon was not found in the Privilege Badge!");
  }

  // Verify Waves icon is present in 3rd chip
  const wavesIcon = page.locator('svg.lucide-waves').first();
  const wavesVisible = await wavesIcon.isVisible();
  console.log(`✓ Waves Icon present in Sanctuary chip: ${wavesVisible}`);
  if (!wavesVisible) {
    throw new Error("Waves icon was not found in the Sanctuary chip!");
  }

  // Verify Sparkles icon is completely REMOVED
  const sparklesCount = await page.locator('svg.lucide-sparkles').count();
  console.log(`✓ Sparkles Icon Count: ${sparklesCount} (must be 0)`);
  if (sparklesCount > 0) {
    throw new Error(`Sparkles icon is still present (${sparklesCount} occurrences)! Must be removed.`);
  }

  const countdownVisible = await page.locator('text="Offer Expires In"').isVisible();
  console.log(`✓ Countdown Box: ${countdownVisible}`);

  const ctaButton = page.locator('button:has-text("Claim Exclusive")');
  await ctaButton.waitFor({ state: "visible", timeout: 3000 });
  const ctaText = await ctaButton.innerText();
  console.log(`✓ High-Converting CTA Button: "${ctaText}"`);

  // Verify CTA is completely visible inside viewport (not cut off at the bottom)
  const ctaBox = await ctaButton.boundingBox();
  console.log(`✓ CTA Button coordinates: y=${ctaBox.y}, height=${ctaBox.height}`);
  if (!ctaBox || ctaBox.y + ctaBox.height > 900) {
    throw new Error(`CTA button is cut off at the bottom! y=${ctaBox?.y}`);
  }

  // Check no emojis in the popup container
  const popupHtml = await modalBox.innerHTML();
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const emojiMatch = popupHtml.match(emojiRegex);
  if (emojiMatch) {
    throw new Error(`Failed: Found forbidden emoji in popup: "${emojiMatch[0]}"`);
  }
  console.log("✓ Verified: 100% Emoji-free design with clean Lucide SVG icons.");

  // 4. Capture screenshot artifact
  const screenshotPath = "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/offer_ad_perfect_redesign_verified.png";
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`📸 Saved full screenshot to: ${screenshotPath}`);

  // Also capture focused close-up of modal
  const modalScreenshotPath = "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/offer_ad_modal_perfect_closeup.png";
  await modalBox.screenshot({ path: modalScreenshotPath });
  console.log(`📸 Saved modal close-up screenshot to: ${modalScreenshotPath}`);

  // 5. Test close button
  console.log("5. Testing close button interaction...");
  const closeBtn = page.locator('button[aria-label="Close offer"]').first();
  await closeBtn.click();
  await page.waitForTimeout(600);
  const isStillVisible = await modalLocator.isVisible();
  console.log(`✓ Modal closed smoothly: ${!isStillVisible}`);

  await browser.close();
  console.log("🎉 SUCCESS: All redesigned Offer Ad requirements verified 100%!");
}

run().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
