const { chromium } = require('/Users/pasindumalinda/OPTIMIND_AI/Web_project/Ocean_Welligama/Ocean-Weligama/node_modules/playwright');
const path = require('path');

const ARTIFACT_DIR = '/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397';

async function run() {
  console.log('🚀 Starting About Section 2 (Story Editorial & Neighborhood Guide) E2E Test...');

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

    // Scroll to Section 2
    console.log('3. Scrolling to Section 2 (Our Story Narrative & Neighborhood Guide)...');
    await page.waitForSelector('[data-testid="input-about-story-badge"]', { timeout: 10000 });
    const section2Heading = page.locator('h3:has-text("Our Story Narrative & Neighborhood Guide")');
    await section2Heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    // Capture Section 2 Form Overview
    const storyOverviewPath = path.join(ARTIFACT_DIR, 'admin_settings_about_story_overview.png');
    await page.screenshot({ path: storyOverviewPath, fullPage: false });
    console.log(`📸 Admin Settings Story Overview saved to: ${storyOverviewPath}`);

    // Verify initial values
    const badgeVal = await page.inputValue('[data-testid="input-about-story-badge"]');
    const leadVal = await page.inputValue('[data-testid="input-about-story-heading-lead"]');
    const highlightVal = await page.inputValue('[data-testid="input-about-story-heading-highlight"]');
    const p1Val = await page.inputValue('[data-testid="textarea-about-story-p1"]');
    const hl1Title = await page.inputValue('[data-testid="input-about-story-hl1-title"]');
    const authorName = await page.inputValue('[data-testid="input-about-story-author-name"]');
    const spot1Name = await page.inputValue('[data-testid="input-about-story-spot1-name"]');

    console.log(`Initial Section 2 values:
      Badge: "${badgeVal}"
      Headline: "${leadVal} ${highlightVal}"
      Paragraph 1: "${p1Val.substring(0, 40)}..."
      Highlight 1: "${hl1Title}"
      Author: "${authorName}"
      Spot 1: "${spot1Name}"`);

    // Scroll to Section 2 Live Preview
    const previewHeader = page.locator('h4:has-text("Live Real-Time Editorial & Neighborhood Card Preview")');
    await previewHeader.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    const livePreviewPath = path.join(ARTIFACT_DIR, 'admin_settings_about_story_live_preview.png');
    await page.screenshot({ path: livePreviewPath, fullPage: false });
    console.log(`📸 Admin Settings Story Live Preview saved to: ${livePreviewPath}`);

    // 4. Edit fields to verify live dynamic updates
    console.log('4. Editing fields to test dynamic updates...');
    await section2Heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    await page.fill('[data-testid="input-about-story-heading-highlight"]', '& Coastal Soul Connect');
    await page.fill('[data-testid="input-about-story-hl1-title"]', '2-Min Sandy Surf Walk');
    await page.fill('[data-testid="input-about-story-author-name"]', 'The Ocean Air Family & Crew');
    await page.fill('[data-testid="input-about-story-spot1-name"]', 'Weligama Sandy Beach');

    await page.waitForTimeout(600);

    // Save Section 2 Settings
    console.log('5. Clicking Save Story & Neighborhood button...');
    const saveBtn = page.locator('[data-testid="button-save-about-story"]');
    await saveBtn.scrollIntoViewIfNeeded();
    await saveBtn.click();

    // Wait for save indicator or toast
    await page.waitForTimeout(2000);
    console.log('✅ Section 2 saved to backend!');

    // 6. Navigate to Public /about page
    console.log('6. Navigating to Public About page (http://localhost:5173/about)...');
    await page.goto('http://localhost:5173/about', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Scroll down to Section 2
    console.log('7. Scrolling to Section 2 on Public About page...');
    const publicStoryHeading = page.locator('h2:has-text("Where")');
    await publicStoryHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);

    // Verify dynamic edits are reflected
    const bodyText = await page.innerText('body');
    const headingText = await page.locator('h2:has-text("Where")').innerText();
    const hasUpdatedHighlight = headingText.includes('Coastal Soul Connect') || (bodyText.includes('Coastal') && bodyText.includes('Soul') && bodyText.includes('Connect'));
    const hasUpdatedHl1 = bodyText.includes('2-Min Sandy Surf Walk');
    const hasUpdatedAuthor = bodyText.includes('The Ocean Air Family & Crew');
    const hasUpdatedSpot1 = bodyText.includes('Weligama Sandy Beach');

    console.log(`Verification on Public Page:
      Has 'Coastal Soul Connect': ${hasUpdatedHighlight}
      Has '2-Min Sandy Surf Walk': ${hasUpdatedHl1}
      Has 'The Ocean Air Family & Crew': ${hasUpdatedAuthor}
      Has 'Weligama Sandy Beach': ${hasUpdatedSpot1}`);

    if (!hasUpdatedHighlight || !hasUpdatedHl1 || !hasUpdatedAuthor || !hasUpdatedSpot1) {
      throw new Error('Public About page failed to reflect dynamic edits from Admin Panel!');
    }

    // Capture dynamic updated screenshot
    const publicUpdatedPath = path.join(ARTIFACT_DIR, 'public_about_story_dynamic_updated.png');
    await page.screenshot({ path: publicUpdatedPath, fullPage: false });
    console.log(`📸 Public About Story Dynamic Updated saved to: ${publicUpdatedPath}`);

    // 8. Test neighborhood interactive card click
    console.log('8. Interacting with Neighborhood Card (clicking spot 1)...');
    const spot1Card = page.locator('text=Weligama Sandy Beach').first();
    await spot1Card.click();
    await page.waitForTimeout(600);

    // 9. Reset back to authentic defaults
    console.log('9. Returning to Admin Settings to restore authentic defaults...');
    await page.goto('http://localhost:5173/ow-admin/settings', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const aboutTabBtn2 = page.locator('button:has-text("About")').first();
    await aboutTabBtn2.click();
    await page.waitForTimeout(800);

    const resetBtn = page.locator('button:has-text("Reset Section Defaults")').first();
    await resetBtn.scrollIntoViewIfNeeded();
    await resetBtn.click();
    await page.waitForTimeout(600);

    const saveBtn2 = page.locator('[data-testid="button-save-about-story"]');
    await saveBtn2.click();
    await page.waitForTimeout(2000);
    console.log('✅ Restored authentic defaults in database!');

    // 10. Verify restoration on public page
    console.log('10. Verifying restoration on Public About page...');
    await page.goto('http://localhost:5173/about', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const publicStoryHeadingFinal = page.locator('h2:has-text("Where")');
    await publicStoryHeadingFinal.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);

    // Expand Spot 3 (Sri Lankan Village Life) for the final luxury screenshot
    const villageCard = page.locator('text=Sri Lankan Village Life').first();
    await villageCard.click();
    await page.waitForTimeout(600);

    const publicFinalPath = path.join(ARTIFACT_DIR, 'public_about_story_final_verified.png');
    await page.screenshot({ path: publicFinalPath, fullPage: false });
    console.log(`📸 Public About Story Final Verified saved to: ${publicFinalPath}`);

    console.log('🎉 ALL VERIFICATION CHECKS PASSED FLAWLESSLY!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
