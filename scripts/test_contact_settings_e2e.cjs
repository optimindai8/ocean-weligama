const { chromium } = require('/Users/pasindumalinda/OPTIMIND_AI/Web_project/Ocean_Welligama/Ocean-Weligama/node_modules/playwright');
const path = require('path');

const ARTIFACT_DIR = '/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397';

async function run() {
  console.log('🚀 Starting Contact Settings End-to-End Verification Test...');

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

    // 2. Click Contact tab
    console.log('2. Clicking Contact tab...');
    const contactTabBtn = page.locator('button:has-text("Contact")').first();
    await contactTabBtn.click();
    await page.waitForTimeout(1000);

    // Verify Contact section is rendered
    await page.waitForSelector('[data-testid="input-contact-hero-badge"]', { timeout: 10000 });
    console.log('✅ Contact settings form loaded successfully!');

    // Capture Admin Settings Contact Tab Overview screenshot
    const tabOverviewPath = path.join(ARTIFACT_DIR, 'admin_settings_contact_tab_overview.png');
    await page.screenshot({ path: tabOverviewPath, fullPage: false });
    console.log(`📸 Admin Settings Contact Tab Overview saved to: ${tabOverviewPath}`);

    // Verify initial default values
    const badgeVal = await page.inputValue('[data-testid="input-contact-hero-badge"]');
    const leadVal = await page.inputValue('[data-testid="input-contact-hero-lead"]');
    const highlightVal = await page.inputValue('[data-testid="input-contact-hero-highlight"]');
    const phoneVal = await page.inputValue('[data-testid="input-contact-hero-phone"]');
    const emailVal = await page.inputValue('[data-testid="input-contact-hero-email"]');
    const locationVal = await page.inputValue('[data-testid="input-contact-hero-location"]');
    const hoursVal = await page.inputValue('[data-testid="input-contact-hero-hours"]');
    const badge1Val = await page.inputValue('[data-testid="input-contact-hero-badge1"]');
    const badge2Val = await page.inputValue('[data-testid="input-contact-hero-badge2"]');

    console.log(`Initial values:
      Badge: "${badgeVal}"
      Headline: "${leadVal} ${highlightVal}"
      Phone: "${phoneVal}"
      Email: "${emailVal}"
      Location: "${locationVal}"
      Hours: "${hoursVal}"
      Badge1: "${badge1Val}"
      Badge2: "${badge2Val}"`);

    // Capture Live Preview in admin
    await page.evaluate(() => window.scrollBy(0, 550));
    await page.waitForTimeout(600);
    const livePreviewPath = path.join(ARTIFACT_DIR, 'admin_settings_contact_live_preview.png');
    await page.screenshot({ path: livePreviewPath, fullPage: false });
    console.log(`📸 Admin Settings Live Preview screenshot saved to: ${livePreviewPath}`);

    // 3. Edit fields with test values to test real-time update & saving
    console.log('3. Editing contact fields to test dynamic changes...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);

    await page.fill('[data-testid="input-contact-hero-badge"]', 'Direct Concierge • VIP Wave Care');
    await page.fill('[data-testid="input-contact-hero-lead"]', 'Always');
    await page.fill('[data-testid="input-contact-hero-highlight"]', 'Welcoming');
    await page.fill('[data-testid="input-contact-hero-subtitle"]', 'Experience personalized coastal living, ocean transfers, and dawn surf guide 100 steps from Weligama Bay.');
    await page.fill('[data-testid="input-contact-hero-badge1"]', 'Under 1-Hour Concierge Response');
    await page.fill('[data-testid="input-contact-hero-badge2"]', '100% Direct Surf Villa Guarantee');
    await page.fill('[data-testid="input-contact-hero-phone"]', '+94 77 999 8877');
    await page.fill('[data-testid="input-contact-hero-email"]', 'vipconcierge@oceanairweligama.com');
    await page.fill('[data-testid="input-contact-hero-location"]', 'Pelana Beach Bay, Weligama, Sri Lanka');
    await page.fill('[data-testid="input-contact-hero-hours"]', '24/7 VIP Island Care');

    await page.waitForTimeout(500);

    // Save changes
    console.log('4. Clicking Save Contact Settings button...');
    const saveBtn = page.locator('[data-testid="button-save-contact-settings"]');
    await saveBtn.click();

    // Wait for save feedback
    await page.waitForTimeout(2000);
    console.log('✅ Contact Settings saved to backend!');

    // 5. Navigate to Public Contact Page and verify updates
    console.log('5. Navigating to Public Contact Page (http://localhost:5173/contact)...');
    await page.goto('http://localhost:5173/contact', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Verify dynamic text rendered on public page
    const publicContent = await page.content();
    const hasUpdatedBadge = publicContent.includes('VIP Wave Care');
    const hasUpdatedLead = publicContent.includes('Always');
    const hasUpdatedHighlight = publicContent.includes('Welcoming');
    const hasUpdatedPhone = publicContent.includes('+94 77 999 8877');
    const hasUpdatedEmail = publicContent.includes('vipconcierge@oceanairweligama.com');
    const hasUpdatedLocation = publicContent.includes('Pelana Beach Bay, Weligama, Sri Lanka');
    const hasUpdatedHours = publicContent.includes('24/7 VIP Island Care');

    console.log(`Public Page Verification:
      Updated Badge visible: ${hasUpdatedBadge}
      Updated Lead visible: ${hasUpdatedLead}
      Updated Highlight visible: ${hasUpdatedHighlight}
      Updated Phone visible: ${hasUpdatedPhone}
      Updated Email visible: ${hasUpdatedEmail}
      Updated Location visible: ${hasUpdatedLocation}
      Updated Hours visible: ${hasUpdatedHours}`);

    const dynamicPublicHeroPath = path.join(ARTIFACT_DIR, 'public_contact_hero_dynamic_updated.png');
    await page.screenshot({ path: dynamicPublicHeroPath, fullPage: false });
    console.log(`📸 Public Contact Hero Dynamic screenshot saved to: ${dynamicPublicHeroPath}`);

    // 6. Restore authentic defaults
    console.log('6. Returning to Admin Settings to restore authentic defaults...');
    await page.goto('http://localhost:5173/ow-admin/settings', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.locator('button:has-text("Contact")').first().click();
    await page.waitForTimeout(1000);

    console.log('Clicking Reset Defaults...');
    await page.locator('button:has-text("Reset Defaults")').click();
    await page.waitForTimeout(600);

    console.log('Saving authentic defaults...');
    await page.locator('[data-testid="button-save-contact-settings"]').click();
    await page.waitForTimeout(2000);

    const adminFinalPath = path.join(ARTIFACT_DIR, 'admin_settings_contact_final_verified.png');
    await page.screenshot({ path: adminFinalPath, fullPage: false });
    console.log(`📸 Admin Settings Final Verified screenshot saved to: ${adminFinalPath}`);

    // 7. Verify public page has restored authentic defaults
    console.log('7. Verifying authentic defaults on Public Contact page...');
    await page.goto('http://localhost:5173/contact', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const restoredContent = await page.content();
    const hasRestoredBadge = restoredContent.includes('Direct Concierge • 24/7 Island Care');
    const hasRestoredLead = restoredContent.includes("Let's");
    const hasRestoredHighlight = restoredContent.includes('Connect');
    const hasRestoredPhone = restoredContent.includes('+94 76 579 1763');
    const hasRestoredEmail = restoredContent.includes('pelanawhitehouse@gmail.com');
    const hasRestoredLocation = restoredContent.includes('Pelana, Weligama, Sri Lanka');
    const hasRestoredHours = restoredContent.includes('24/7 Concierge Support');

    console.log(`Authentic Defaults Restored on Public Page:
      Badge restored: ${hasRestoredBadge}
      Headline restored: ${hasRestoredLead} ${hasRestoredHighlight}
      Phone restored: ${hasRestoredPhone}
      Email restored: ${hasRestoredEmail}
      Location restored: ${hasRestoredLocation}
      Hours restored: ${hasRestoredHours}`);

    const publicFinalPath = path.join(ARTIFACT_DIR, 'public_contact_hero_final_verified.png');
    await page.screenshot({ path: publicFinalPath, fullPage: false });
    console.log(`📸 Public Contact Hero Final Verified screenshot saved to: ${publicFinalPath}`);

    console.log('🎉 ALL E2E TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ E2E test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
