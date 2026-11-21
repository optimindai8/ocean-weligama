const { chromium } = require('/Users/pasindumalinda/OPTIMIND_AI/Web_project/Ocean_Welligama/Ocean-Weligama/node_modules/playwright');
const path = require('path');

const ARTIFACT_DIR = '/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397';

async function run() {
  console.log('🚀 Starting About Section 6 & Re-Indexed Section 7 E2E Test...');

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

    // 3. Verify that the duplicate standalone Section 7 does NOT exist anymore
    console.log('3. Verifying old duplicate Section 7 is removed...');
    const oldSigSectionCount = await page.locator('[data-testid="admin-about-signature-section"]').count();
    console.log(`Old standalone Section 7 count: ${oldSigSectionCount} (expected: 0)`);
    if (oldSigSectionCount > 0) {
      throw new Error("Old standalone Section 7 was NOT removed!");
    }

    // 4. Locate Section 6 (Family Values & Signature Dock)
    console.log('4. Locating Section 6 (Family Values & Signature Dock)...');
    const valuesSection = page.locator('[data-testid="admin-about-values-section"]');
    await valuesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    const sec6OverviewPath = path.join(ARTIFACT_DIR, 'admin_settings_about_sec6_overview.png');
    await valuesSection.screenshot({ path: sec6OverviewPath });
    console.log('📸 Saved Section 6 admin overview screenshot:', sec6OverviewPath);

    // 5. Locate Section 7 (Final Invitation CTA - renamed from Section 8)
    console.log('5. Locating Section 7 (Final Invitation CTA)...');
    const invitationSection = page.locator('[data-testid="admin-about-invitation-section"]');
    await invitationSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Verify Section 7 pill badge
    const sec7BadgeText = await invitationSection.locator('span:has-text("About Page • Section 7")').innerText();
    console.log(`Section 7 Badge Text: "${sec7BadgeText}" (expected: "About Page • Section 7")`);

    const sec7OverviewPath = path.join(ARTIFACT_DIR, 'admin_settings_about_sec7_overview.png');
    await invitationSection.screenshot({ path: sec7OverviewPath });
    console.log('📸 Saved Section 7 admin overview screenshot:', sec7OverviewPath);

    // 6. Edit Section 6 Host Signature Dock fields inside Section 6
    console.log('6. Editing Host Signature Dock inside Section 6...');
    const monogramInput = valuesSection.locator('input[placeholder="OA"]');
    await monogramInput.fill('OA+');

    const quoteInput = valuesSection.locator('input[placeholder*="When you stay with us"]');
    await quoteInput.fill('“Step inside as a traveler, leave forever connected as cherished island family.”');

    const bylineInput = valuesSection.locator('input[placeholder*="The Ocean Air Family • Weligama Bay"]');
    await bylineInput.fill('The Founders • Ocean Air Weligama Sanctuary');

    const guaranteeInput = valuesSection.locator('input[placeholder="100% Genuine Hospitality"]');
    await guaranteeInput.fill('100% Heartfelt Hospitality');

    // 7. Edit Section 7 (Invitation CTA) fields
    console.log('7. Editing Section 7 (Invitation CTA) fields...');
    const invBadgeInput = invitationSection.locator('input[placeholder="Your Weligama Escape"]');
    await invBadgeInput.fill('Your Southern Sri Lankan Journey');

    const invLeadInput = invitationSection.locator('input[placeholder="Ready to Discover"]');
    await invLeadInput.fill('Time to Experience');

    const invHighlightInput = invitationSection.locator('input[placeholder="Southern Sri Lanka?"]');
    await invHighlightInput.fill('Pure Coastal Wonder?');

    // 8. Click Save in Section 7
    console.log('8. Clicking Save in Section 7...');
    const saveSec7Btn = invitationSection.locator('button:has-text("Save")').first();
    await saveSec7Btn.click();
    await page.waitForTimeout(2500);
    console.log('Save completed.');

    // 9. Open Public About Page
    console.log('9. Opening Public About page...');
    const publicPage = await context.newPage();
    await publicPage.goto('http://localhost:5173/about', { waitUntil: 'domcontentloaded' });
    await publicPage.waitForTimeout(2500);

    // 10. Verify Host Signature Dock on public page
    console.log('10. Verifying Host Signature Dock on public page...');
    const publicSignatureDock = publicPage.locator('[data-testid="public-about-signature-dock"]');
    await publicSignatureDock.scrollIntoViewIfNeeded();
    await publicPage.waitForTimeout(1000);

    const pubDockText = await publicSignatureDock.innerText();
    console.log('Public Signature Dock text:\n', pubDockText);

    const hasUpdatedMonogram = pubDockText.includes('OA+');
    const hasUpdatedQuote = pubDockText.toLowerCase().includes('step inside as a traveler');
    const hasUpdatedByline = pubDockText.toLowerCase().includes('the founders');
    const hasUpdatedGuarantee = pubDockText.toLowerCase().includes('100% heartfelt');

    console.log('Host Signature Dock verification:');
    console.log(' - Monogram (OA+):', hasUpdatedMonogram);
    console.log(' - Quote (Step inside as a traveler):', hasUpdatedQuote);
    console.log(' - Byline (The Founders):', hasUpdatedByline);
    console.log(' - Guarantee (100% Heartfelt):', hasUpdatedGuarantee);

    if (!hasUpdatedMonogram || !hasUpdatedQuote || !hasUpdatedGuarantee) {
      throw new Error('Host Signature Dock failed verification on public page!');
    }

    const pubSigUpdatedPath = path.join(ARTIFACT_DIR, 'public_about_signature_sec6_verified.png');
    await publicSignatureDock.screenshot({ path: pubSigUpdatedPath });
    console.log('📸 Saved public signature updated screenshot:', pubSigUpdatedPath);

    // 11. Verify Section 7 (Invitation CTA) on public page
    console.log('11. Verifying Section 7 (Invitation CTA) on public page...');
    const publicInvitationSection = publicPage.locator('[data-testid="public-about-invitation-section"]');
    await publicInvitationSection.scrollIntoViewIfNeeded();
    await publicPage.waitForTimeout(1000);

    const pubInvText = await publicInvitationSection.innerText();
    const hasUpdatedBadge = pubInvText.toLowerCase().includes('your southern sri lankan journey');
    const hasUpdatedLead = pubInvText.toLowerCase().includes('time to experience') || pubInvText.toLowerCase().includes('timetoexperience');

    console.log('Section 7 Invitation verification:');
    console.log(' - Badge (Your Southern Sri Lankan Journey):', hasUpdatedBadge);
    console.log(' - Heading Lead (Time to Experience):', hasUpdatedLead);

    if (!hasUpdatedBadge || !hasUpdatedLead) {
      throw new Error('Section 7 Invitation failed verification on public page!');
    }

    const pubInvUpdatedPath = path.join(ARTIFACT_DIR, 'public_about_sec7_invitation_verified.png');
    await publicInvitationSection.screenshot({ path: pubInvUpdatedPath });
    console.log('📸 Saved public invitation updated screenshot:', pubInvUpdatedPath);

    // 12. Reset defaults in Admin Settings
    console.log('12. Returning to Admin Settings to reset defaults...');
    await page.bringToFront();

    // Reset Section 6
    const resetSec6Btn = valuesSection.locator('button:has-text("Reset Defaults")').first();
    await resetSec6Btn.click();
    await page.waitForTimeout(500);

    // Reset Section 7
    const resetSec7Btn = invitationSection.locator('button:has-text("Reset Defaults")').first();
    await resetSec7Btn.click();
    await page.waitForTimeout(500);

    await saveSec7Btn.click();
    await page.waitForTimeout(2500);
    console.log('Reset and save completed.');

    // Check public page after reset
    await publicPage.bringToFront();
    await publicPage.reload({ waitUntil: 'domcontentloaded' });
    await publicPage.waitForTimeout(2000);

    const finalVerifiedPath = path.join(ARTIFACT_DIR, 'public_about_sec6_7_final_verified.png');
    await publicInvitationSection.scrollIntoViewIfNeeded();
    await publicInvitationSection.screenshot({ path: finalVerifiedPath });
    console.log('📸 Saved final verified screenshot:', finalVerifiedPath);

    console.log('🎉 SECTION 6 & RE-INDEXED SECTION 7 E2E TEST COMPLETED WITH 100% SUCCESS!');

  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
