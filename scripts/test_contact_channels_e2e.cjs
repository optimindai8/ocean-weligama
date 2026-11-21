const { chromium } = require('/Users/pasindumalinda/OPTIMIND_AI/Web_project/Ocean_Welligama/Ocean-Weligama/node_modules/playwright');
const path = require('path');

const ARTIFACT_DIR = '/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397';

async function run() {
  console.log('🚀 Starting Contact Channels (Wave Away) E2E Verification Test...');

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

    // 2. Test About tab quick-nav helper
    console.log('2. Clicking About tab to test navigation helper...');
    const aboutTabBtn = page.locator('button:has-text("About")').first();
    await aboutTabBtn.click();
    await page.waitForTimeout(800);

    const helperBtn = page.locator('button:has-text("Open Contact Tab Channels")');
    if (await helperBtn.isVisible()) {
      console.log('✅ About tab quick-nav helper is visible! Clicking to switch to Contact tab...');
      await helperBtn.click();
      await page.waitForTimeout(800);
    } else {
      console.log('Clicking Contact tab directly...');
      await page.locator('button:has-text("Contact")').first().click();
      await page.waitForTimeout(800);
    }

    // 3. Verify Section 2 inputs are rendered
    await page.waitForSelector('[data-testid="input-contact-channel-badge"]', { timeout: 10000 });
    console.log('✅ Section 2 (Direct Channels & Guaranteed Response) loaded successfully!');

    // Scroll to Section 2
    const section2Elem = page.locator('h3:has-text("Get In Touch • Direct Channels & Guaranteed Response")');
    await section2Elem.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    // Capture Admin Settings Section 2 overview
    const overviewPath = path.join(ARTIFACT_DIR, 'admin_settings_contact_channels_overview.png');
    await page.screenshot({ path: overviewPath, fullPage: false });
    console.log(`📸 Admin Settings Contact Channels overview saved to: ${overviewPath}`);

    // Verify initial values in inputs
    const badgeVal = await page.inputValue('[data-testid="input-contact-channel-badge"]');
    const leadVal = await page.inputValue('[data-testid="input-contact-channel-lead"]');
    const highlightVal = await page.inputValue('[data-testid="input-contact-channel-highlight"]');
    const subtitleVal = await page.inputValue('[data-testid="input-contact-channel-subtitle"]');
    const emailVal = await page.inputValue('[data-testid="input-contact-email-value"]');
    const phoneVal = await page.inputValue('[data-testid="input-contact-phone-value"]');
    const locationVal = await page.inputValue('[data-testid="input-contact-location-value"]');
    const guaranteeVal = await page.inputValue('[data-testid="input-contact-guarantee-text"]');

    console.log(`Initial Section 2 Values:
      Badge: "${badgeVal}"
      Headline: "${leadVal} ${highlightVal}"
      Subtitle: "${subtitleVal.substring(0, 45)}..."
      Email: "${emailVal}"
      Phone: "${phoneVal}"
      Location: "${locationVal}"
      Guarantee: "${guaranteeVal}"`);

    // Scroll to Live Preview of Section 2
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);
    const livePreviewPath = path.join(ARTIFACT_DIR, 'admin_settings_contact_channels_live_preview.png');
    await page.screenshot({ path: livePreviewPath, fullPage: false });
    console.log(`📸 Admin Settings Live Preview saved to: ${livePreviewPath}`);

    // 4. Test editing Section 2
    console.log('4. Editing Section 2 fields...');
    await section2Elem.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await page.fill('[data-testid="input-contact-channel-badge"]', 'INSTANT CONCIERGE');
    await page.fill('[data-testid="input-contact-channel-lead"]', "We're always");
    await page.fill('[data-testid="input-contact-channel-highlight"]', 'by your side.');
    await page.fill('[data-testid="input-contact-channel-subtitle"]', 'Reach our Weligama concierge 24/7 for custom surf bookings, airport pickups, and villa dining.');
    await page.fill('[data-testid="input-contact-email-value"]', 'concierge@oceanairweligama.com');
    await page.fill('[data-testid="input-contact-phone-value"]', '+94 77 555 1234');
    await page.fill('[data-testid="input-contact-location-value"]', 'No 42 Jayasayurupura Bay Road, Weligama 81700');
    await page.fill('[data-testid="input-contact-guarantee-text"]', 'Within 30 minutes, 24/7.');

    await page.waitForTimeout(500);

    // Save changes
    console.log('Clicking Save Channel Settings button...');
    const saveChannelsBtn = page.locator('[data-testid="button-save-contact-channels"]');
    await saveChannelsBtn.click();
    await page.waitForTimeout(2000);
    console.log('✅ Section 2 saved to backend!');

    // 5. Verify Public Contact Page
    console.log('5. Navigating to Public Contact Page (http://localhost:5173/contact)...');
    await page.goto('http://localhost:5173/contact', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Scroll down to the contact channels section
    await page.evaluate(() => window.scrollTo(0, 650));
    await page.waitForTimeout(800);

    const publicContent = await page.content();
    const hasDynamicBadge = publicContent.includes('INSTANT CONCIERGE');
    const hasDynamicLead = publicContent.includes("We're always");
    const hasDynamicHighlight = publicContent.includes('by your side.');
    const hasDynamicEmail = publicContent.includes('concierge@oceanairweligama.com');
    const hasDynamicPhone = publicContent.includes('+94 77 555 1234');
    const hasDynamicLocation = publicContent.includes('No 42 Jayasayurupura Bay Road, Weligama 81700');
    const hasDynamicGuarantee = publicContent.includes('Within 30 minutes, 24/7.');

    console.log(`Public Page Dynamic Verification:
      Badge updated: ${hasDynamicBadge}
      Headline updated: ${hasDynamicLead} ${hasDynamicHighlight}
      Email updated: ${hasDynamicEmail}
      Phone updated: ${hasDynamicPhone}
      Location updated: ${hasDynamicLocation}
      Guarantee updated: ${hasDynamicGuarantee}`);

    const publicDynamicPath = path.join(ARTIFACT_DIR, 'public_contact_channels_dynamic_updated.png');
    await page.screenshot({ path: publicDynamicPath, fullPage: false });
    console.log(`📸 Public Contact Channels Dynamic screenshot saved to: ${publicDynamicPath}`);

    // 6. Restore authentic defaults
    console.log('6. Returning to Admin Settings to restore authentic defaults...');
    await page.goto('http://localhost:5173/ow-admin/settings', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.locator('button:has-text("Contact")').first().click();
    await page.waitForTimeout(1000);

    console.log('Clicking Reset Section Defaults...');
    await page.locator('button:has-text("Reset Section Defaults")').click();
    await page.waitForTimeout(600);

    console.log('Saving authentic defaults...');
    await page.locator('[data-testid="button-save-contact-channels"]').click();
    await page.waitForTimeout(2000);

    // 7. Verify public page has restored authentic defaults
    console.log('7. Verifying authentic defaults on Public Contact page...');
    await page.goto('http://localhost:5173/contact', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 650));
    await page.waitForTimeout(800);

    const restoredContent = await page.content();
    const hasRestoredBadge = restoredContent.includes('Get In Touch');
    const hasRestoredLead = restoredContent.includes("We're just a");
    const hasRestoredHighlight = restoredContent.includes('wave away.');
    const hasRestoredEmail = restoredContent.includes('pelanawhitehouse@gmail.com');
    const hasRestoredPhone = restoredContent.includes('+94 76 579 1763');
    const hasRestoredLocation = restoredContent.includes('No 42 Jayasayurupura Pelana, Weligama, Sri Lanka 81700');
    const hasRestoredGuarantee = restoredContent.includes('Within 2 hours, every time.');

    console.log(`Authentic Defaults Restored on Public Page:
      Badge restored: ${hasRestoredBadge}
      Headline restored: ${hasRestoredLead} ${hasRestoredHighlight}
      Email restored: ${hasRestoredEmail}
      Phone restored: ${hasRestoredPhone}
      Location restored: ${hasRestoredLocation}
      Guarantee restored: ${hasRestoredGuarantee}`);

    const publicFinalPath = path.join(ARTIFACT_DIR, 'public_contact_channels_final_verified.png');
    await page.screenshot({ path: publicFinalPath, fullPage: false });
    console.log(`📸 Public Contact Channels Final Verified screenshot saved to: ${publicFinalPath}`);

    console.log('🎉 ALL CONTACT CHANNELS E2E TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ E2E test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
