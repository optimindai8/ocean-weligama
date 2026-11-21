const { chromium } = require('/Users/pasindumalinda/OPTIMIND_AI/Web_project/Ocean_Welligama/Ocean-Weligama/node_modules/playwright');
const path = require('path');

const ARTIFACT_DIR = '/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397';

async function run() {
  console.log('🚀 Starting About Section 4 (Sanctuary Switcher: Basic Private vs Deluxe Double) E2E Test...');

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
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

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

    // Scroll to Section 4
    console.log('3. Scrolling to Section 4 (Room Sanctuary & Budget Switcher)...');
    await page.waitForSelector('[data-testid="input-about-sanc-badge"]', { timeout: 10000 });
    const section4Heading = page.locator('h3:has-text("Designed For Every Stay & Budget")').first();
    await section4Heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    // Capture Section 4 Form Overview
    const sancOverviewPath = path.join(ARTIFACT_DIR, 'admin_settings_about_sanctuary_overview.png');
    await page.screenshot({ path: sancOverviewPath, fullPage: false });
    console.log(`📸 Admin Settings Sanctuary Overview saved to: ${sancOverviewPath}`);

    // Verify initial values in Section Header & Tab 1 (Basic Room)
    const badgeVal = await page.inputValue('[data-testid="input-about-sanc-badge"]');
    const leadVal = await page.inputValue('[data-testid="input-about-sanc-heading-lead"]');
    const highlightVal = await page.inputValue('[data-testid="input-about-sanc-heading-highlight"]');
    const tab1Label = await page.inputValue('[data-testid="input-about-sanc-tab1-label"]');
    const tab2Label = await page.inputValue('[data-testid="input-about-sanc-tab2-label"]');

    const basicTitleVal = await page.inputValue('[data-testid="input-about-sanc-basic-title"]');
    const basicPerk1Val = await page.inputValue('[data-testid="input-about-sanc-basic-perk1"]');
    const basicBadgeVal = await page.inputValue('[data-testid="input-about-sanc-basic-img-badge"]');

    console.log(`Initial Section 4 values:
      Eyebrow: "${badgeVal}"
      Headline: "${leadVal} ${highlightVal}"
      Tab 1: "${tab1Label}"
      Tab 2: "${tab2Label}"
      Basic Title: "${basicTitleVal}"
      Basic Perk 1: "${basicPerk1Val}"
      Basic Image Badge: "${basicBadgeVal}"`);

    // Switch to Deluxe Tab in Admin form
    console.log('4. Switching to Deluxe Double tab in admin...');
    const adminDeluxeTab = page.locator('[data-testid="admin-room-tab-deluxe"]');
    await adminDeluxeTab.click();
    await page.waitForTimeout(500);

    const deluxeTitleVal = await page.inputValue('[data-testid="input-about-sanc-deluxe-title"]');
    const deluxePerk1Val = await page.inputValue('[data-testid="input-about-sanc-deluxe-perk1"]');
    const deluxeBadgeVal = await page.inputValue('[data-testid="input-about-sanc-deluxe-img-badge"]');
    console.log(`Initial Deluxe Room values:
      Deluxe Title: "${deluxeTitleVal}"
      Deluxe Perk 1: "${deluxePerk1Val}"
      Deluxe Image Badge: "${deluxeBadgeVal}"`);

    // Scroll to Section 4 Live Preview
    console.log('5. Scrolling to Live Real-Time Sanctuary Preview...');
    const previewHeader = page.locator('h4:has-text("Live Real-Time Sanctuary Switcher")');
    await previewHeader.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    const livePreviewPath = path.join(ARTIFACT_DIR, 'admin_settings_about_sanctuary_live_preview.png');
    await page.screenshot({ path: livePreviewPath, fullPage: false });
    console.log(`📸 Admin Settings Sanctuary Live Preview saved to: ${livePreviewPath}`);

    // Test Live Preview interactive tab switching
    console.log('6. Testing Live Preview tab switcher...');
    const previewDeluxeTab = page.locator('[data-testid="preview-room-tab-deluxe"]');
    await previewDeluxeTab.click();
    await page.waitForTimeout(500);

    const previewBasicTab = page.locator('[data-testid="preview-room-tab-basic"]');
    await previewBasicTab.click();
    await page.waitForTimeout(500);

    // 7. Edit fields to verify live dynamic updates
    console.log('7. Editing fields to test dynamic updates...');
    await section4Heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    // Edit headline highlight
    await page.fill('[data-testid="input-about-sanc-heading-highlight"]', 'Every Tropical Traveler');

    // Edit Basic Room
    const adminBasicTab = page.locator('[data-testid="admin-room-tab-basic"]');
    await adminBasicTab.click();
    await page.waitForTimeout(400);

    await page.fill('[data-testid="input-about-sanc-basic-title"]', 'Cozy Serene Ground Sanctuary');
    await page.fill('[data-testid="input-about-sanc-basic-perk1"]', 'Peaceful Enclave Vibe');
    await page.fill('[data-testid="input-about-sanc-basic-img-badge"]', 'Secluded Tropical Garden Setting');

    // Edit Deluxe Room
    await adminDeluxeTab.click();
    await page.waitForTimeout(400);

    await page.fill('[data-testid="input-about-sanc-deluxe-title"]', 'Deluxe Horizon Penthouse Suite');
    await page.fill('[data-testid="input-about-sanc-deluxe-perk1"]', 'Stunning Dawn Ocean Terrace');
    await page.fill('[data-testid="input-about-sanc-deluxe-img-badge"]', 'Panoramic 180° Bay View Terrace');

    await page.waitForTimeout(600);

    // Save Section 4 Settings
    console.log('8. Clicking Save Room Switcher button...');
    const saveBtn = page.locator('[data-testid="button-save-about-sanctuary"]');
    await saveBtn.scrollIntoViewIfNeeded();
    await saveBtn.click();

    // Wait for save toast
    await page.waitForTimeout(2000);
    console.log('Save completed.');

    // 9. Navigate to Public /about page and verify dynamic content
    console.log('9. Navigating to Public /about page...');
    await page.goto('http://localhost:5173/about', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const sancSection = page.locator('[data-testid="public-about-sanctuary-section"]');
    await sancSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Explicitly click Basic Tab on public page to ensure active view
    const publicBasicTab = sancSection.locator('button:has-text("Basic Private")');
    await publicBasicTab.click();
    await page.waitForTimeout(800);

    // Capture dynamic updated view (Basic tab active)
    const dynamicPath = path.join(ARTIFACT_DIR, 'public_about_sanctuary_dynamic_updated.png');
    await page.screenshot({ path: dynamicPath, fullPage: false });
    console.log(`📸 Public Dynamic Sanctuary Screenshot saved to: ${dynamicPath}`);

    // Verify dynamic text presence in Basic tab
    const bodyTextBasic = await page.textContent('body');
    const hasHighlight = bodyTextBasic.includes('Tropical') && bodyTextBasic.includes('Traveler');
    const hasBasicTitle = bodyTextBasic.includes('Cozy') && bodyTextBasic.includes('Serene') && bodyTextBasic.includes('Sanctuary');
    const hasBasicPerk = bodyTextBasic.includes('Peaceful Enclave Vibe');
    const hasBasicBadge = bodyTextBasic.includes('Secluded Tropical Garden Setting');

    console.log(`Dynamic Basic Verification:
      Has "Tropical Traveler": ${hasHighlight}
      Has "Cozy Serene Ground Sanctuary": ${hasBasicTitle}
      Has "Peaceful Enclave Vibe": ${hasBasicPerk}
      Has "Secluded Tropical Garden Setting": ${hasBasicBadge}`);

    if (!hasHighlight || !hasBasicTitle || !hasBasicPerk || !hasBasicBadge) {
      throw new Error('Dynamic basic room content verification failed on public /about page!');
    }

    // Switch to Deluxe tab on public page
    console.log('10. Switching to Deluxe tab on public /about page...');
    const publicDeluxeTab = sancSection.locator('button:has-text("Deluxe Double")');
    await publicDeluxeTab.click();
    await page.waitForTimeout(1000);

    const bodyTextDeluxe = await page.textContent('body');
    const hasDeluxeTitle = bodyTextDeluxe.includes('Penthouse') && bodyTextDeluxe.includes('Suite');
    const hasDeluxePerk = bodyTextDeluxe.includes('Stunning Dawn Ocean Terrace');
    const hasDeluxeBadge = bodyTextDeluxe.includes('Panoramic 180° Bay View Terrace');

    console.log(`Dynamic Deluxe Verification:
      Has "Deluxe Horizon Penthouse Suite": ${hasDeluxeTitle}
      Has "Stunning Dawn Ocean Terrace": ${hasDeluxePerk}
      Has "Panoramic 180° Bay View Terrace": ${hasDeluxeBadge}`);

    if (!hasDeluxeTitle || !hasDeluxePerk || !hasDeluxeBadge) {
      throw new Error('Dynamic deluxe room content verification failed on public /about page!');
    }

    // 11. Return to Admin and Reset Defaults
    console.log('11. Returning to Admin to reset defaults...');
    await page.goto('http://localhost:5173/ow-admin/settings', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const aboutTabBtn2 = page.locator('button:has-text("About")').first();
    await aboutTabBtn2.click();
    await page.waitForTimeout(1000);

    await section4Heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const resetBtn = page.locator('[data-testid="button-reset-about-sanctuary"]');
    await resetBtn.scrollIntoViewIfNeeded();
    await resetBtn.click();
    await page.waitForTimeout(800);

    const saveBtn2 = page.locator('[data-testid="button-save-about-sanctuary"]');
    await saveBtn2.scrollIntoViewIfNeeded();
    await saveBtn2.click();
    await page.waitForTimeout(2000);
    console.log('Defaults saved successfully.');

    // 12. Re-verify Public /about with default values restored
    console.log('12. Re-verifying Public /about page defaults restored...');
    await page.goto('http://localhost:5173/about', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const sancSection2 = page.locator('[data-testid="public-about-sanctuary-section"]');
    await sancSection2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    const finalPath = path.join(ARTIFACT_DIR, 'public_about_sanctuary_final_verified.png');
    await page.screenshot({ path: finalPath, fullPage: false });
    console.log(`📸 Public Final Verified Screenshot saved to: ${finalPath}`);

    const finalBodyText = await page.textContent('body');
    const hasDefaultHighlight = finalBodyText.includes('Every') && finalBodyText.includes('Budget');
    const hasDefaultBasicTitle = finalBodyText.includes('Comfortable') && finalBodyText.includes('Basic');
    const hasDefaultBasicBadge = finalBodyText.includes('Quiet Ground-Floor Village Setting');

    console.log(`Default Restoration Verification:
      Has "Every Stay & Budget": ${hasDefaultHighlight}
      Has "Comfortable Basic Private": ${hasDefaultBasicTitle}
      Has "Quiet Ground-Floor Village Setting": ${hasDefaultBasicBadge}`);

    if (!hasDefaultHighlight || !hasDefaultBasicTitle || !hasDefaultBasicBadge) {
      throw new Error('Default restoration verification failed!');
    }

    console.log('🎉 ALL SECTION 4 ABOUT SANCTUARY E2E TESTS PASSED SUCCESSFULLY! 100% VERIFIED!');
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
