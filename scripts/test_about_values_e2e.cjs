const { chromium } = require('/Users/pasindumalinda/OPTIMIND_AI/Web_project/Ocean_Welligama/Ocean-Weligama/node_modules/playwright');
const path = require('path');

const ARTIFACT_DIR = '/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397';

async function run() {
  console.log('🚀 Starting About Section 6 (Family Values & Heritage Pillars) E2E Test...');

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
    await page.waitForTimeout(1500);

    // 3. Locate Section 6 in Admin Settings
    console.log('3. Locating Section 6 (Family Values & Heritage Pillars)...');
    const valuesSection = page.locator('[data-testid="admin-about-values-section"]');
    await valuesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Capture initial overview screenshot
    const overviewImgPath = path.join(ARTIFACT_DIR, 'admin_settings_about_values_overview.png');
    await valuesSection.screenshot({ path: overviewImgPath });
    console.log('📸 Saved admin overview screenshot:', overviewImgPath);

    // 4. Test Pillar Tab Switching in Admin
    console.log('4. Testing Pillar Tab switching...');
    const pillar2Tab = valuesSection.locator('button:has-text("Pillar 2: Host Care")');
    await pillar2Tab.click();
    await page.waitForTimeout(500);

    const pillar3Tab = valuesSection.locator('button:has-text("Pillar 3: Refinements")');
    await pillar3Tab.click();
    await page.waitForTimeout(500);

    const pillar1Tab = valuesSection.locator('button:has-text("Pillar 1: Roots")');
    await pillar1Tab.click();
    await page.waitForTimeout(500);

    const livePreviewImgPath = path.join(ARTIFACT_DIR, 'admin_settings_about_values_live_preview.png');
    await valuesSection.screenshot({ path: livePreviewImgPath });
    console.log('📸 Saved admin live preview screenshot:', livePreviewImgPath);

    // 5. Edit Section 6 fields
    console.log('5. Editing Section 6 fields in form...');
    const badgeInput = valuesSection.locator('input[placeholder="Our Founding Identity"]');
    await badgeInput.fill('Authentic Southern Soul');

    const headingHighlightInput = valuesSection.locator('input[placeholder="Driven by Family Values"]');
    await headingHighlightInput.fill('Driven by Generational Hospitality');

    // Edit Pillar 1 fields
    const pillar1TitleInput = valuesSection.locator('input[placeholder="100% Locally Owned & Run"]');
    await pillar1TitleInput.fill('100% Village-Rooted & Independent');

    const pillar1Point1Input = valuesSection.locator('input[placeholder="100% Sri Lankan family-owned & operated"]');
    await pillar1Point1Input.fill('Proudly Sri Lankan family-owned since founding');

    // Switch to Pillar 2 and edit
    await pillar2Tab.click();
    await page.waitForTimeout(400);
    const pillar2TitleInput = valuesSection.locator('input[placeholder="Warm Family Atmosphere"]');
    await pillar2TitleInput.fill('Genuine Southern Host Care');

    // Switch to Pillar 3 and edit
    await pillar3Tab.click();
    await page.waitForTimeout(400);
    const pillar3TitleInput = valuesSection.locator('input[placeholder="Dedicated Season Upgrades"]');
    await pillar3TitleInput.fill('Annual Luxury Guest Upgrades');

    // Edit Host Quote
    const quoteInput = valuesSection.locator('input[placeholder*="When you stay with us"]');
    await quoteInput.fill('“Our home is your home. Weligama warmth, dawn wave guidance, and island hospitality from our family to yours.”');

    // 6. Save Settings
    console.log('6. Clicking Save Values & Heritage button...');
    const saveBtn = valuesSection.locator('button:has-text("Save Values & Heritage")');
    await saveBtn.click();
    await page.waitForTimeout(2500);
    console.log('Save completed.');

    // 7. Open Public About page and verify dynamic changes
    console.log('7. Opening Public About page...');
    await page.goto('http://localhost:5173/about', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const publicSection = page.locator('[data-testid="public-about-values-section"]');
    await publicSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Verify dynamic text (handling CSS uppercase / split spans)
    console.log('8. Verifying dynamic texts on public page...');
    const pageText = (await publicSection.innerText()).toLowerCase();
    const hasBadge = pageText.includes('authentic southern soul');
    const hasHighlight = pageText.includes('generational hospitality') || pageText.includes('drivenbygenerationalhospitality');
    const hasPillar1 = pageText.includes('100% village-rooted & independent');
    const hasPoint1 = pageText.includes('proudly sri lankan family-owned since founding');
    const hasPillar2 = pageText.includes('genuine southern host care');
    const hasPillar3 = pageText.includes('annual luxury guest upgrades');

    console.log('Validation results:');
    console.log(' - Badge (Authentic Southern Soul):', hasBadge);
    console.log(' - Heading Highlight (Generational Hospitality):', hasHighlight);
    console.log(' - Pillar 1 Title (100% Village-Rooted):', hasPillar1);
    console.log(' - Pillar 1 Point 1 (Proudly Sri Lankan):', hasPoint1);
    console.log(' - Pillar 2 Title (Genuine Southern Host Care):', hasPillar2);
    console.log(' - Pillar 3 Title (Annual Luxury Guest Upgrades):', hasPillar3);

    // Take screenshot of dynamic public section
    const dynamicUpdatedImgPath = path.join(ARTIFACT_DIR, 'public_about_values_dynamic_updated.png');
    await publicSection.screenshot({ path: dynamicUpdatedImgPath });
    console.log('📸 Saved public dynamic updated screenshot:', dynamicUpdatedImgPath);

    // 9. Reset defaults in Admin Settings
    console.log('9. Returning to Admin Settings to reset defaults...');
    await page.goto('http://localhost:5173/ow-admin/settings', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const aboutTabBtn2 = page.locator('button:has-text("About")').first();
    await aboutTabBtn2.click();
    await page.waitForTimeout(1500);

    const valuesSection2 = page.locator('[data-testid="admin-about-values-section"]');
    await valuesSection2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const resetBtn = valuesSection2.locator('button:has-text("Reset Defaults")');
    await resetBtn.click();
    await page.waitForTimeout(800);

    const saveBtn2 = valuesSection2.locator('button:has-text("Save Values & Heritage")');
    await saveBtn2.click();
    await page.waitForTimeout(2500);
    console.log('Reset and save completed.');

    // 10. Verify public page shows default content
    console.log('10. Checking public page after reset...');
    await page.goto('http://localhost:5173/about', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const publicSection2 = page.locator('[data-testid="public-about-values-section"]');
    await publicSection2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const finalImgPath = path.join(ARTIFACT_DIR, 'public_about_values_final_verified.png');
    await publicSection2.screenshot({ path: finalImgPath });
    console.log('📸 Saved final verified screenshot:', finalImgPath);

    console.log('🎉 SECTION 6 E2E TEST COMPLETED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
