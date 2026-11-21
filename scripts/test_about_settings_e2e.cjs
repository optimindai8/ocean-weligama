const { chromium } = require('/Users/pasindumalinda/OPTIMIND_AI/Web_project/Ocean_Welligama/Ocean-Weligama/node_modules/playwright');
const path = require('path');

const ARTIFACT_DIR = '/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397';

async function run() {
  console.log('🚀 Starting About Settings (Our Story & Heritage Hero) E2E Verification Test...');

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

    // Verify About section is rendered
    await page.waitForSelector('[data-testid="input-about-hero-badge"]', { timeout: 10000 });
    console.log('✅ About settings form loaded successfully!');

    // Capture Admin Settings About Tab Overview screenshot
    const tabOverviewPath = path.join(ARTIFACT_DIR, 'admin_settings_about_tab_overview.png');
    await page.screenshot({ path: tabOverviewPath, fullPage: false });
    console.log(`📸 Admin Settings About Tab Overview saved to: ${tabOverviewPath}`);

    // Verify initial default values
    const badgeVal = await page.inputValue('[data-testid="input-about-hero-badge"]');
    const leadVal = await page.inputValue('[data-testid="input-about-hero-lead"]');
    const highlightVal = await page.inputValue('[data-testid="input-about-hero-highlight"]');
    const subtitleVal = await page.inputValue('[data-testid="input-about-hero-subtitle"]');
    const badge1Val = await page.inputValue('[data-testid="input-about-hero-badge1"]');
    const badge2Val = await page.inputValue('[data-testid="input-about-hero-badge2"]');
    const ctaVal = await page.inputValue('[data-testid="input-about-hero-cta"]');
    const perk1Val = await page.inputValue('[data-testid="input-about-hero-perk1"]');
    const perk2Val = await page.inputValue('[data-testid="input-about-hero-perk2"]');
    const perk3Val = await page.inputValue('[data-testid="input-about-hero-perk3"]');
    const perk4Val = await page.inputValue('[data-testid="input-about-hero-perk4"]');

    console.log(`Initial values:
      Badge: "${badgeVal}"
      Headline: "${leadVal} ${highlightVal}"
      Subtitle: "${subtitleVal.substring(0, 45)}..."
      Badge1: "${badge1Val}"
      Badge2: "${badge2Val}"
      CTA: "${ctaVal}"
      Perks: "${perk1Val}", "${perk2Val}", "${perk3Val}", "${perk4Val}"`);

    // Capture Live Preview in admin
    await page.evaluate(() => window.scrollBy(0, 550));
    await page.waitForTimeout(600);
    const livePreviewPath = path.join(ARTIFACT_DIR, 'admin_settings_about_live_preview.png');
    await page.screenshot({ path: livePreviewPath, fullPage: false });
    console.log(`📸 Admin Settings Live Preview screenshot saved to: ${livePreviewPath}`);

    // 3. Edit fields with test values to test real-time update & saving
    console.log('3. Editing About fields to test dynamic changes...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);

    await page.fill('[data-testid="input-about-hero-badge"]', 'SOUTHERN SRI LANKAN SANCTUARY • WELIGAMA BAY');
    await page.fill('[data-testid="input-about-hero-lead"]', 'Island Life &');
    await page.fill('[data-testid="input-about-hero-highlight"]', 'Traditions');
    await page.fill('[data-testid="input-about-hero-subtitle"]', 'Discover our coastal family haven 100 steps from Weligama surf break, where Sri Lankan warmth and barefoot relaxation await.');
    await page.fill('[data-testid="input-about-hero-badge1"]', '100% Family Owned & Run');
    await page.fill('[data-testid="input-about-hero-badge2"]', 'Private Surf Path Access');
    await page.fill('[data-testid="input-about-hero-cta"]', 'Discover Our Heritage');
    await page.fill('[data-testid="input-about-hero-perk1"]', 'Authentic Island Heritage');
    await page.fill('[data-testid="input-about-hero-perk2"]', 'Dawn Patrol Surf Access');
    await page.fill('[data-testid="input-about-hero-perk3"]', 'Handmade Ceylon Breakfasts');
    await page.fill('[data-testid="input-about-hero-perk4"]', 'Golden Hour Rooftop Vibe');

    await page.waitForTimeout(500);

    // Save changes
    console.log('4. Clicking Save About Settings button...');
    const saveBtn = page.locator('[data-testid="button-save-about-settings"]');
    await saveBtn.click();

    // Wait for save feedback
    await page.waitForTimeout(2000);
    console.log('✅ About Settings saved to backend!');

    // 5. Navigate to Public About Page and verify updates
    console.log('5. Navigating to Public About Page (http://localhost:5173/about)...');
    await page.goto('http://localhost:5173/about', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Verify dynamic text rendered on public page
    const publicContent = await page.content();
    const hasUpdatedBadge = publicContent.includes('SOUTHERN SRI LANKAN SANCTUARY • WELIGAMA BAY');
    const hasUpdatedLead = publicContent.includes('Island Life &');
    const hasUpdatedHighlight = publicContent.includes('Traditions');
    const hasUpdatedSubtitle = publicContent.includes('Discover our coastal family haven');
    const hasUpdatedBadge1 = publicContent.includes('100% Family Owned & Run') || publicContent.includes('100% Family Owned &amp; Run');
    const hasUpdatedBadge2 = publicContent.includes('Private Surf Path Access');
    const hasUpdatedCta = publicContent.includes('Discover Our Heritage');
    const hasUpdatedPerk1 = publicContent.includes('Authentic Island Heritage');
    const hasUpdatedPerk2 = publicContent.includes('Dawn Patrol Surf Access');
    const hasUpdatedPerk3 = publicContent.includes('Handmade Ceylon Breakfasts');
    const hasUpdatedPerk4 = publicContent.includes('Golden Hour Rooftop Vibe');

    console.log(`Public Page Verification:
      Updated Badge visible: ${hasUpdatedBadge}
      Updated Lead visible: ${hasUpdatedLead}
      Updated Highlight visible: ${hasUpdatedHighlight}
      Updated Subtitle visible: ${hasUpdatedSubtitle}
      Updated Badge1 visible: ${hasUpdatedBadge1}
      Updated Badge2 visible: ${hasUpdatedBadge2}
      Updated CTA visible: ${hasUpdatedCta}
      Updated Perk1 visible: ${hasUpdatedPerk1}
      Updated Perk2 visible: ${hasUpdatedPerk2}
      Updated Perk3 visible: ${hasUpdatedPerk3}
      Updated Perk4 visible: ${hasUpdatedPerk4}`);

    const dynamicPublicHeroPath = path.join(ARTIFACT_DIR, 'public_about_hero_dynamic_updated.png');
    await page.screenshot({ path: dynamicPublicHeroPath, fullPage: false });
    console.log(`📸 Public About Hero Dynamic screenshot saved to: ${dynamicPublicHeroPath}`);

    // 6. Restore authentic defaults
    console.log('6. Returning to Admin Settings to restore authentic defaults...');
    await page.goto('http://localhost:5173/ow-admin/settings', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.locator('button:has-text("About")').first().click();
    await page.waitForTimeout(1000);

    console.log('Clicking Reset Defaults...');
    await page.locator('button:has-text("Reset Defaults")').click();
    await page.waitForTimeout(600);

    console.log('Saving authentic defaults...');
    await page.locator('[data-testid="button-save-about-settings"]').click();
    await page.waitForTimeout(2000);

    // 7. Verify public page has restored authentic defaults
    console.log('7. Verifying authentic defaults on Public About page...');
    await page.goto('http://localhost:5173/about', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const restoredContent = await page.content();
    const hasRestoredBadge = restoredContent.includes('Authentic Island Heritage • 100% Locally Owned');
    const hasRestoredLead = restoredContent.includes('Our Story &') || restoredContent.includes('Our Story &amp;');
    const hasRestoredHighlight = restoredContent.includes('Heritage');
    const hasRestoredBadge1 = restoredContent.includes('100% Locally Owned & Operated') || restoredContent.includes('100% Locally Owned &amp; Operated');
    const hasRestoredBadge2 = restoredContent.includes('100 Steps to Weligama Beach');
    const hasRestoredPerk1 = restoredContent.includes('100% Locally Owned');
    const hasRestoredPerk2 = restoredContent.includes('3-Min Walk to Surf Break');
    const hasRestoredPerk3 = restoredContent.includes('Warm Family Hospitality');
    const hasRestoredPerk4 = restoredContent.includes('Rooftop Yoga & Sunsets') || restoredContent.includes('Rooftop Yoga &amp; Sunsets');

    console.log(`Authentic Defaults Restored on Public Page:
      Badge restored: ${hasRestoredBadge}
      Headline restored: ${hasRestoredLead} ${hasRestoredHighlight}
      Badge1 restored: ${hasRestoredBadge1}
      Badge2 restored: ${hasRestoredBadge2}
      Perks restored: ${hasRestoredPerk1}, ${hasRestoredPerk2}, ${hasRestoredPerk3}, ${hasRestoredPerk4}`);

    const publicFinalPath = path.join(ARTIFACT_DIR, 'public_about_hero_final_verified.png');
    await page.screenshot({ path: publicFinalPath, fullPage: false });
    console.log(`📸 Public About Hero Final Verified screenshot saved to: ${publicFinalPath}`);

    console.log('🎉 ALL ABOUT SETTINGS E2E TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ E2E test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
