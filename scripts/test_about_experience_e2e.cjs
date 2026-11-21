const { chromium } = require('/Users/pasindumalinda/OPTIMIND_AI/Web_project/Ocean_Welligama/Ocean-Weligama/node_modules/playwright');
const path = require('path');

const ARTIFACT_DIR = '/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397';

async function run() {
  console.log('🚀 Starting About Section 3 (Experience Customizer & Tailored Concierge) E2E Test...');

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
    viewport: { width: 1440, height: 1100 }
  });
  const page = await context.newPage();

  // Set auth token before page loads
  await page.addInitScript((tok) => {
    localStorage.setItem("ow-admin-token", tok);
  }, token);

  try {
    // 1. Navigate to Admin Settings
    console.log('1. Navigating to Admin Settings page...');
    await page.goto('http://localhost:5173/ow-admin/settings', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // 2. Click About tab
    console.log('2. Clicking About tab...');
    const aboutTabBtn = page.locator('button:has-text("About")').first();
    await aboutTabBtn.click();
    await page.waitForTimeout(1000);

    // Scroll to Section 3
    console.log('3. Scrolling to Section 3 (Experience Customizer & Tailored Concierge)...');
    await page.waitForSelector('[data-testid="input-about-exp-badge"]', { timeout: 10000 });
    const section3Heading = page.locator('h3:has-text("Experience Builder & Tailored Stay Concierge")');
    await section3Heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    // Capture Section 3 Form Overview
    const expOverviewPath = path.join(ARTIFACT_DIR, 'admin_settings_about_experience_overview.png');
    await page.screenshot({ path: expOverviewPath, fullPage: false });
    console.log(`📸 Admin Settings Experience Overview saved to: ${expOverviewPath}`);

    // Verify initial values
    const badgeVal = await page.inputValue('[data-testid="input-about-exp-badge"]');
    const leadVal = await page.inputValue('[data-testid="input-about-exp-heading-lead"]');
    const highlightVal = await page.inputValue('[data-testid="input-about-exp-heading-highlight"]');
    const subtitleVal = await page.inputValue('[data-testid="textarea-about-exp-subtitle"]');
    const pill1Val = await page.inputValue('[data-testid="input-about-exp-pill1"]');
    const pill2Val = await page.inputValue('[data-testid="input-about-exp-pill2"]');
    const pill3Val = await page.inputValue('[data-testid="input-about-exp-pill3"]');
    const addOnsTitle = await page.inputValue('[data-testid="input-about-exp-addons-title"]');
    const tailoredTitle = await page.inputValue('[data-testid="input-about-exp-tailored-title"]');
    const benefit1Val = await page.inputValue('[data-testid="input-about-exp-benefit1"]');

    console.log(`Initial Section 3 values:
      Badge: "${badgeVal}"
      Headline: "${leadVal} ${highlightVal}"
      Subtitle: "${subtitleVal.substring(0, 40)}..."
      Pill 1: "${pill1Val}"
      Pill 2: "${pill2Val}"
      Pill 3: "${pill3Val}"
      Add-Ons Title: "${addOnsTitle}"
      Tailored Title: "${tailoredTitle}"
      Benefit 1: "${benefit1Val}"`);

    // Scroll to Section 3 Live Preview
    const previewHeader = page.locator('h4:has-text("Live Real-Time Experience Builder")');
    await previewHeader.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    const livePreviewPath = path.join(ARTIFACT_DIR, 'admin_settings_about_experience_live_preview.png');
    await page.screenshot({ path: livePreviewPath, fullPage: false });
    console.log(`📸 Admin Settings Experience Live Preview saved to: ${livePreviewPath}`);

    // 4. Edit fields to verify live dynamic updates
    console.log('4. Editing fields to test dynamic updates...');
    await section3Heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    await page.fill('[data-testid="input-about-exp-heading-highlight"]', 'At Your Tropical Rhythm');
    await page.fill('[data-testid="input-about-exp-pill1"]', 'Flexible Island Pace');
    await page.fill('[data-testid="input-about-exp-tailored-title"]', 'Your Bespoke Island Stay');
    await page.fill('[data-testid="input-about-exp-benefit1"]', 'Flexible booking online or upon welcoming arrival');

    await page.waitForTimeout(600);

    // Save Section 3 Settings
    console.log('5. Clicking Save Experience Customizer button...');
    const saveBtn = page.locator('[data-testid="button-save-about-experience"]');
    await saveBtn.scrollIntoViewIfNeeded();
    await saveBtn.click();

    // Wait for save toast
    await page.waitForTimeout(2000);
    console.log('Save completed.');

    // 6. Navigate to Public /about page and verify dynamic content
    console.log('6. Navigating to Public /about page...');
    await page.goto('http://localhost:5173/about', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const expSection = page.locator('[data-testid="public-about-experience-section"]');
    await expSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // Capture dynamic updated view
    const dynamicPath = path.join(ARTIFACT_DIR, 'public_about_experience_dynamic_updated.png');
    await page.screenshot({ path: dynamicPath, fullPage: false });
    console.log(`📸 Public Dynamic Experience Screenshot saved to: ${dynamicPath}`);

    // Verify dynamic text presence
    const bodyText = await page.textContent('body');
    const hasHighlight = bodyText.includes('At Your Tropical Rhythm') || (bodyText.includes('Tropical') && bodyText.includes('Rhythm'));
    const hasPill1 = bodyText.includes('Flexible Island Pace');
    const hasTailored = bodyText.includes('Your Bespoke Island Stay');
    const hasBenefit1 = bodyText.includes('Flexible booking online or upon welcoming arrival');

    console.log(`Dynamic Verification:
      Has "At Your Tropical Rhythm": ${hasHighlight}
      Has "Flexible Island Pace": ${hasPill1}
      Has "Your Bespoke Island Stay": ${hasTailored}
      Has "Flexible booking online or upon welcoming arrival": ${hasBenefit1}`);

    if (!hasHighlight || !hasPill1 || !hasTailored || !hasBenefit1) {
      throw new Error('Dynamic content verification failed on public /about page!');
    }

    // 7. Return to Admin and Reset Defaults
    console.log('7. Returning to Admin to reset defaults...');
    await page.goto('http://localhost:5173/ow-admin/settings', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const aboutTabBtn2 = page.locator('button:has-text("About")').first();
    await aboutTabBtn2.click();
    await page.waitForTimeout(1000);

    await section3Heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const resetBtn = page.locator('[data-testid="button-reset-about-experience"]');
    await resetBtn.scrollIntoViewIfNeeded();
    await resetBtn.click();
    await page.waitForTimeout(800);

    const saveBtn2 = page.locator('[data-testid="button-save-about-experience"]');
    await saveBtn2.scrollIntoViewIfNeeded();
    await saveBtn2.click();
    await page.waitForTimeout(2000);
    console.log('Defaults saved successfully.');

    // 8. Re-verify Public /about with default values restored
    console.log('8. Re-verifying Public /about page defaults restored...');
    await page.goto('http://localhost:5173/about', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const expSection2 = page.locator('[data-testid="public-about-experience-section"]');
    await expSection2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    const finalPath = path.join(ARTIFACT_DIR, 'public_about_experience_final_verified.png');
    await page.screenshot({ path: finalPath, fullPage: false });
    console.log(`📸 Public Final Verified Screenshot saved to: ${finalPath}`);

    const finalBodyText = await page.textContent('body');
    const hasDefaultHighlight = finalBodyText.includes('At Your Own Pace') || (finalBodyText.includes('Own') && finalBodyText.includes('Pace'));
    const hasDefaultPill = finalBodyText.includes('Zero Strict Schedules');
    const hasDefaultTailored = finalBodyText.includes('Your Tailored Stay');

    console.log(`Default Restoration Verification:
      Has "At Your Own Pace": ${hasDefaultHighlight}
      Has "Zero Strict Schedules": ${hasDefaultPill}
      Has "Your Tailored Stay": ${hasDefaultTailored}`);

    if (!hasDefaultHighlight || !hasDefaultPill || !hasDefaultTailored) {
      throw new Error('Default restoration verification failed!');
    }

    console.log('🎉 ALL SECTION 3 ABOUT E2E TESTS PASSED SUCCESSFULLY! 100% VERIFIED!');
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
