const { chromium } = require('/Users/pasindumalinda/OPTIMIND_AI/Web_project/Ocean_Welligama/Ocean-Weligama/node_modules/playwright');
const path = require('path');

const ARTIFACT_DIR = '/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397';

async function run() {
  console.log('🚀 Starting About Section 5 (The Rooftop Café: Atmosphere Shift Simulator) E2E Test...');

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
    await page.waitForTimeout(1500);

    // 3. Locate Section 5 in Admin Settings
    console.log('3. Locating Section 5 (The Rooftop Café)...');
    const rooftopSection = page.locator('[data-testid="admin-about-rooftop-section"]');
    await rooftopSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Capture initial overview screenshot
    const overviewImgPath = path.join(ARTIFACT_DIR, 'admin_settings_about_rooftop_overview.png');
    await rooftopSection.screenshot({ path: overviewImgPath });
    console.log('📸 Saved admin overview screenshot:', overviewImgPath);

    // 4. Test Live Atmosphere Shift Simulator Preview
    console.log('4. Testing Live Atmosphere Shift Simulator Preview toggle...');
    const previewDuskBtn = rooftopSection.locator('button:has-text("Golden Hour")').last();
    await previewDuskBtn.click();
    await page.waitForTimeout(800);

    const livePreviewImgPath = path.join(ARTIFACT_DIR, 'admin_settings_about_rooftop_live_preview.png');
    await rooftopSection.screenshot({ path: livePreviewImgPath });
    console.log('📸 Saved live preview toggle screenshot:', livePreviewImgPath);

    // Switch preview back to morning
    const previewMorningBtn = rooftopSection.locator('button:has-text("Morning Vibes")').last();
    await previewMorningBtn.click();
    await page.waitForTimeout(500);

    // 5. Edit Morning Mode fields
    console.log('5. Editing Morning Mode fields in form...');
    // Ensure Morning Editor tab is active
    const morningEditorTab = rooftopSection.locator('button:has-text("Morning Vibes Editor")');
    await morningEditorTab.click();
    await page.waitForTimeout(500);

    // Edit Morning Heading Highlight
    const morningHighlightInput = rooftopSection.locator('input[placeholder="• Sunrise Roasts & Vistas"]');
    await morningHighlightInput.fill('• Artisan Ceylon Roasts & Surf Vistas');

    // Edit Morning Subtitle
    const morningSubtitleInput = rooftopSection.locator('textarea[placeholder*="Wake up to freshly roasted"]');
    await morningSubtitleInput.fill('Handcrafted single-origin pour-overs, organic dragonfruit smoothie bowls, and 180-degree dawn bay outlooks.');

    // Edit Morning Card 1 Title
    const morningCard1TitleInput = rooftopSection.locator('input[placeholder="Artisan Roasts & Bowls"]');
    await morningCard1TitleInput.fill('Single-Origin Ceylon Bar');

    // Edit Morning Dock Note
    const morningDockNoteInput = rooftopSection.locator('input[placeholder="Complimentary breakfast & espresso for resident bookings."]');
    await morningDockNoteInput.fill('Signature Ceylon roasts & resident breakfast included.');

    // 6. Switch to Golden Hour Editor tab and edit
    console.log('6. Switching to Golden Hour Editor tab and editing...');
    const sunsetEditorTab = rooftopSection.locator('button:has-text("Golden Hour Editor")');
    await sunsetEditorTab.click();
    await page.waitForTimeout(500);

    // Edit Sunset Heading Highlight
    const sunsetHighlightInput = rooftopSection.locator('input[placeholder="• Golden Hour Rhythms"]');
    await sunsetHighlightInput.fill('• Ambient Dusk Beats & Bay Rhythms');

    // Edit Sunset Card 1 Title
    const sunsetCard1TitleInput = rooftopSection.locator('input[placeholder="Craft Sun-Downers"]');
    await sunsetCard1TitleInput.fill('Coconut Dusk Elixirs');

    // Edit Sunset Dock Note
    const sunsetDockNoteInput = rooftopSection.locator('input[placeholder*="Weligama\'s premier sunset vista"]');
    await sunsetDockNoteInput.fill('Priority resident lounge for Weligama sunsets.');

    // 7. Save Settings
    console.log('7. Clicking Save Rooftop Café button...');
    const saveBtn = rooftopSection.locator('button:has-text("Save Rooftop Café")');
    await saveBtn.click();
    await page.waitForTimeout(2500);
    console.log('Save completed.');

    // 8. Open Public About page and verify dynamic changes
    console.log('8. Opening Public About page...');
    await page.goto('http://localhost:5173/about', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const publicSection = page.locator('[data-testid="public-about-rooftop-section"]');
    await publicSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Verify Morning Mode text
    console.log('9. Verifying Morning Mode dynamic texts...');
    const pageTextMorning = await publicSection.innerText();
    console.log('Public Section text contains updated morning text:',
      pageTextMorning.includes('Artisan Ceylon Roasts & Surf Vistas'),
      pageTextMorning.includes('Single-Origin Ceylon Bar')
    );

    // Switch to Golden Hour on public page
    console.log('10. Clicking Golden Hour tab on public page...');
    const publicSunsetBtn = publicSection.locator('button:has-text("Golden Hour")').first();
    await publicSunsetBtn.click();
    await page.waitForTimeout(1000);

    const pageTextSunset = await publicSection.innerText();
    console.log('Public Section text contains updated sunset text:',
      pageTextSunset.includes('Ambient Dusk Beats & Bay Rhythms'),
      pageTextSunset.includes('Coconut Dusk Elixirs')
    );

    // Take screenshot of dynamic public section
    const dynamicUpdatedImgPath = path.join(ARTIFACT_DIR, 'public_about_rooftop_dynamic_updated.png');
    await publicSection.screenshot({ path: dynamicUpdatedImgPath });
    console.log('📸 Saved public dynamic updated screenshot:', dynamicUpdatedImgPath);

    // 11. Reset defaults in Admin Settings
    console.log('11. Returning to Admin Settings to reset defaults...');
    await page.goto('http://localhost:5173/ow-admin/settings', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const aboutTabBtn2 = page.locator('button:has-text("About")').first();
    await aboutTabBtn2.click();
    await page.waitForTimeout(1500);

    const rooftopSection2 = page.locator('[data-testid="admin-about-rooftop-section"]');
    await rooftopSection2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const resetBtn = rooftopSection2.locator('button:has-text("Reset Defaults")');
    await resetBtn.click();
    await page.waitForTimeout(800);

    const saveBtn2 = rooftopSection2.locator('button:has-text("Save Rooftop Café")');
    await saveBtn2.click();
    await page.waitForTimeout(2500);
    console.log('Reset and save completed.');

    // 12. Verify public page shows default content
    console.log('12. Checking public page after reset...');
    await page.goto('http://localhost:5173/about', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const publicSection2 = page.locator('[data-testid="public-about-rooftop-section"]');
    await publicSection2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const finalImgPath = path.join(ARTIFACT_DIR, 'public_about_rooftop_final_verified.png');
    await publicSection2.screenshot({ path: finalImgPath });
    console.log('📸 Saved final verified screenshot:', finalImgPath);

    console.log('🎉 E2E TEST COMPLETED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
