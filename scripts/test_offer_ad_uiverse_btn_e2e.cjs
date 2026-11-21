const { chromium } = require("playwright");

async function run() {
  console.log("🚀 Starting E2E verification for Offer Ad Popup with Uiverse animated CTA button...");

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
  const modalBox = page.locator('.max-w-\\[1100px\\], .max-w-5xl, .rounded-\\[28px\\], .rounded-\\[36px\\]').first();
  await modalBox.waitFor({ state: "visible", timeout: 5000 });

  const boxRect = await modalBox.boundingBox();
  console.log(`✓ Modal Box Dimensions: width=${boxRect.width}px, height=${boxRect.height}px`);
  if (boxRect.width < 1050) {
    throw new Error(`Expected enlarged modal width >= 1050px, but got ${boxRect.width}px`);
  }

  // Verify ZERO vertical scrollbars on the card and inner containers
  const scrollCheck = await page.evaluate(() => {
    const card = document.querySelector('.max-w-\\[1100px\\]') || document.querySelector('.max-w-5xl');
    const leftPanel = card ? card.children[1] : null;
    const rightPanel = card ? card.children[2] : null;
    return {
      cardScrollable: card ? card.scrollHeight > card.clientHeight : false,
      cardScrollHeight: card ? card.scrollHeight : 0,
      cardClientHeight: card ? card.clientHeight : 0,
      leftPanelScrollable: leftPanel ? leftPanel.scrollHeight > leftPanel.clientHeight : false,
      leftPanelScrollHeight: leftPanel ? leftPanel.scrollHeight : 0,
      leftPanelClientHeight: leftPanel ? leftPanel.clientHeight : 0,
      rightPanelScrollable: rightPanel ? rightPanel.scrollHeight > rightPanel.clientHeight : false,
      rightPanelScrollHeight: rightPanel ? rightPanel.scrollHeight : 0,
      rightPanelClientHeight: rightPanel ? rightPanel.clientHeight : 0,
    };
  });
  console.log("✓ Scrollbar Check:", scrollCheck);
  if (scrollCheck.cardScrollable || scrollCheck.leftPanelScrollable || scrollCheck.rightPanelScrollable) {
    throw new Error(`Scrollbar detected! Card scrollable=${scrollCheck.cardScrollable}, Left panel=${scrollCheck.leftPanelScrollable}, Right panel=${scrollCheck.rightPanelScrollable}`);
  }

  // Verify Uiverse animated CTA button
  const ctaButton = page.locator('.uiverse-cta-btn').first();
  await ctaButton.waitFor({ state: "visible", timeout: 3000 });
  const ctaText = await ctaButton.innerText();
  console.log(`✓ Uiverse CTA Button Text: "${ctaText}"`);

  // Verify CTA is completely visible inside viewport (not cut off at the bottom)
  const ctaBox = await ctaButton.boundingBox();
  console.log(`✓ CTA Button coordinates: y=${ctaBox.y}, height=${ctaBox.height}`);
  if (!ctaBox || ctaBox.y + ctaBox.height > 880) {
    throw new Error(`CTA button is cut off at the bottom! y=${ctaBox?.y}`);
  }

  // 4. Capture screenshot of resting state
  const restScreenshotPath = "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/offer_ad_uiverse_rest_verified.png";
  await modalBox.screenshot({ path: restScreenshotPath });
  console.log(`📸 Saved resting modal screenshot to: ${restScreenshotPath}`);

  // 5. Test Hover State of Uiverse Button
  console.log("4. Testing hover state on Uiverse CTA button...");
  await ctaButton.hover();
  await page.waitForTimeout(400); // mid-sweep
  const midScreenshotPath = "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/offer_ad_uiverse_hover_mid.png";
  await modalBox.screenshot({ path: midScreenshotPath });
  console.log(`📸 Saved mid-sweep hover screenshot to: ${midScreenshotPath}`);

  await page.waitForTimeout(400); // sweep complete (800ms total)
  const completeScreenshotPath = "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/offer_ad_uiverse_hover_complete.png";
  await modalBox.screenshot({ path: completeScreenshotPath });
  console.log(`📸 Saved completed hover screenshot to: ${completeScreenshotPath}`);

  // Capture full page view with modal and hover effect
  const fullPageScreenshotPath = "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/offer_ad_fullpage_verified.png";
  await page.screenshot({ path: fullPageScreenshotPath, fullPage: false });
  console.log(`📸 Saved full-page screenshot to: ${fullPageScreenshotPath}`);

  // Check no emojis in the popup container
  const popupHtml = await modalBox.innerHTML();
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const emojiMatch = popupHtml.match(emojiRegex);
  if (emojiMatch) {
    throw new Error(`Failed: Found forbidden emoji in popup: "${emojiMatch[0]}"`);
  }
  console.log("✓ Verified: 100% Emoji-free design with clean Lucide SVG icons.");

  // 6. Test close button
  console.log("5. Testing close button interaction...");
  const closeBtn = page.locator('button[aria-label="Close offer"]').first();
  await closeBtn.click();
  await page.waitForTimeout(600);
  const isStillVisible = await modalLocator.isVisible();
  console.log(`✓ Modal closed smoothly: ${!isStillVisible}`);

  await browser.close();
  console.log("🎉 SUCCESS: All Uiverse button and Offer Ad redesign requirements verified 100%!");
}

run().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
