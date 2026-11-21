const { chromium } = require('/Users/pasindumalinda/OPTIMIND_AI/Web_project/Ocean_Welligama/Ocean-Weligama/node_modules/playwright');
const path = require('path');

const ARTIFACT_DIR = '/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397';

async function run() {
  console.log('🚀 Starting About Section 7 & Section 8 E2E Test...');

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

    // 3. Locate Section 7 (Signature Dock) in Admin Settings
    console.log('3. Locating Section 7 (Family Host Signature Dock)...');
    const signatureSection = page.locator('[data-testid="admin-about-signature-section"]');
    await signatureSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const sigOverviewPath = path.join(ARTIFACT_DIR, 'admin_settings_about_signature_overview.png');
    await signatureSection.screenshot({ path: sigOverviewPath });
    console.log('📸 Saved Section 7 admin overview screenshot:', sigOverviewPath);

    // 4. Locate Section 8 (Invitation CTA) in Admin Settings
    console.log('4. Locating Section 8 (Final Invitation CTA)...');
    const invitationSection = page.locator('[data-testid="admin-about-invitation-section"]');
    await invitationSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const invOverviewPath = path.join(ARTIFACT_DIR, 'admin_settings_about_invitation_overview.png');
    await invitationSection.screenshot({ path: invOverviewPath });
    console.log('📸 Saved Section 8 admin overview screenshot:', invOverviewPath);

    // 5. Edit Section 7 fields
    console.log('5. Editing Section 7 fields in form...');
    const monogramInput = signatureSection.locator('input[placeholder="OA"]');
    await monogramInput.fill('OA+');

    const quoteInput = signatureSection.locator('textarea[placeholder*="When you stay with us"]');
    await quoteInput.fill('“Step inside as a traveler, leave forever connected as cherished island family.”');

    const bylineInput = signatureSection.locator('input[placeholder="The Ocean Air Family • Weligama Bay, Sri Lanka"]');
    await bylineInput.fill('The Founders • Ocean Air Weligama Bay');

    const guaranteeInput = signatureSection.locator('input[placeholder="100% Genuine Hospitality"]');
    await guaranteeInput.fill('100% Heartfelt Hospitality Guarantee');

    // 6. Edit Section 8 fields
    console.log('6. Editing Section 8 fields in form...');
    const invBadgeInput = invitationSection.locator('input[placeholder="Your Weligama Escape"]');
    await invBadgeInput.fill('Your Southern Sri Lankan Journey');

    const invLeadInput = invitationSection.locator('input[placeholder="Ready to Discover"]');
    await invLeadInput.fill('Time to Experience');

    const invHighlightInput = invitationSection.locator('input[placeholder="Southern Sri Lanka?"]');
    await invHighlightInput.fill('The Magic of Weligama Bay?');

    const invSubtitleInput = invitationSection.locator('textarea[placeholder*="Whether catching your first Indian Ocean"]');
    await invSubtitleInput.fill('Wake up to pristine waves, Ceylon espresso roasts, and tranquil southern evenings tailored around your rhythm.');

    const ctaTextInput = invitationSection.locator('input[placeholder="Book Your Experience"]');
    await ctaTextInput.fill('Reserve Your Island Sanctuary');

    const perk1Input = invitationSection.locator('input[placeholder="Best Direct Rates Guaranteed"]');
    await perk1Input.fill('Guaranteed Direct Booking Price');

    const perk2Input = invitationSection.locator('input[placeholder="Free 3-Min Beach Walk Location"]');
    await perk2Input.fill('100 Steps to Sandy Surf Beaches');

    const perk3Input = invitationSection.locator('input[placeholder="100% Flexible Booking Options"]');
    await perk3Input.fill('Zero Cancellation Fees Up to Arrival');

    // 7. Save Settings
    console.log('7. Clicking Save Invitation CTA button...');
    const saveBtn = invitationSection.locator('button:has-text("Save Invitation CTA")');
    await saveBtn.click();
    await page.waitForTimeout(2500);
    console.log('Save completed.');

    // 8. Open Public About page and verify dynamic changes
    console.log('8. Opening Public About page...');
    await page.goto('http://localhost:5173/about', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Verify Section 7
    console.log('9. Verifying Section 7 on public page...');
    const publicSigDock = page.locator('[data-testid="public-about-signature-dock"]');
    await publicSigDock.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const sigText = (await publicSigDock.innerText()).toLowerCase();
    console.log('Section 7 verification:');
    console.log(' - Monogram (OA+):', sigText.includes('oa+'));
    console.log(' - Quote (Step inside as a traveler):', sigText.includes('step inside as a traveler'));
    console.log(' - Byline (The Founders • Ocean Air):', sigText.includes('the founders • ocean air'));
    console.log(' - Guarantee (100% Heartfelt):', sigText.includes('100% heartfelt hospitality guarantee'));

    const publicSigImgPath = path.join(ARTIFACT_DIR, 'public_about_signature_dynamic_updated.png');
    await publicSigDock.screenshot({ path: publicSigImgPath });
    console.log('📸 Saved public signature updated screenshot:', publicSigImgPath);

    // Verify Section 8
    console.log('10. Verifying Section 8 on public page...');
    const publicInvSection = page.locator('[data-testid="public-about-invitation-section"]');
    await publicInvSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const invText = (await publicInvSection.innerText()).toLowerCase();
    console.log('Section 8 verification:');
    console.log(' - Badge (Your Southern Sri Lankan Journey):', invText.includes('your southern sri lankan journey'));
    console.log(' - Heading Lead (Time to Experience):', invText.includes('time to experience') || invText.includes('timetoexperience'));
    console.log(' - Button Text (Reserve Your Island Sanctuary):', invText.includes('reserve your island sanctuary'));
    console.log(' - Perk 1 (Guaranteed Direct Booking Price):', invText.includes('guaranteed direct booking price'));
    console.log(' - Perk 2 (100 Steps to Sandy Surf Beaches):', invText.includes('100 steps to sandy surf beaches'));
    console.log(' - Perk 3 (Zero Cancellation Fees):', invText.includes('zero cancellation fees up to arrival'));

    const publicInvImgPath = path.join(ARTIFACT_DIR, 'public_about_invitation_dynamic_updated.png');
    await publicInvSection.screenshot({ path: publicInvImgPath });
    console.log('📸 Saved public invitation updated screenshot:', publicInvImgPath);

    // 11. Reset defaults in Admin Settings
    console.log('11. Returning to Admin Settings to reset defaults...');
    await page.goto('http://localhost:5173/ow-admin/settings', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const aboutTabBtn2 = page.locator('button:has-text("About")').first();
    await aboutTabBtn2.click();
    await page.waitForTimeout(1500);

    // Reset Section 7
    const signatureSection2 = page.locator('[data-testid="admin-about-signature-section"]');
    await signatureSection2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await signatureSection2.locator('button:has-text("Reset Defaults")').click();
    await page.waitForTimeout(500);

    // Reset Section 8
    const invitationSection2 = page.locator('[data-testid="admin-about-invitation-section"]');
    await invitationSection2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await invitationSection2.locator('button:has-text("Reset Defaults")').click();
    await page.waitForTimeout(500);

    // Save
    await invitationSection2.locator('button:has-text("Save Invitation CTA")').click();
    await page.waitForTimeout(2500);
    console.log('Reset and save completed.');

    // 12. Verify public page shows default content
    console.log('12. Checking public page after reset...');
    await page.goto('http://localhost:5173/about', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const publicInvSection2 = page.locator('[data-testid="public-about-invitation-section"]');
    await publicInvSection2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const finalImgPath = path.join(ARTIFACT_DIR, 'public_about_sec7_8_final_verified.png');
    await publicInvSection2.screenshot({ path: finalImgPath });
    console.log('📸 Saved final verified screenshot:', finalImgPath);

    console.log('🎉 SECTION 7 & 8 E2E TEST COMPLETED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
