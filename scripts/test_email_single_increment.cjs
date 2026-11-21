const { chromium } = require('playwright');
const path = require('path');

async function run() {
  console.log('🚀 Starting E2E test for Email modal cleanup & EXACTLY 1 count tracking verification...');

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 },
    locale: "en-US",
    timezoneId: "Asia/Colombo",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  // 1. Authenticate Admin Token
  console.log('1. Authenticating admin token...');
  const loginRes = await fetch("http://localhost:8080/api/v1/admin/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "admin@oceanweligama.com", password: "OceanAdmin2025!" }),
  });
  const { token } = await loginRes.json();

  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await page.evaluate((tok) => {
    localStorage.setItem("ow-admin-token", tok);
    localStorage.setItem("ocean_air_cookie_consent", "accepted");
  }, token);

  // 2. Read baseline Email Inquiries count
  console.log('2. Loading Admin Visitors page to get baseline count...');
  await page.goto('http://localhost:5173/ow-admin/visitors', { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);

  const emailCard = page.locator('div.rounded-2xl:has-text("Email Inquiries")').first();
  await emailCard.waitFor({ state: 'visible', timeout: 5000 });
  const rawTextBefore = await emailCard.innerText();
  console.log('--- Baseline Email Card ---:\n', rawTextBefore);
  
  // Extract number from card (e.g. "EMAIL INQUIRIES\n35\n1 guests (50%)")
  const matchBefore = rawTextBefore.match(/EMAIL INQUIRIES\s*(\d+)/i);
  const countBefore = matchBefore ? parseInt(matchBefore[1], 10) : 0;
  console.log(`Baseline Count: ${countBefore}`);

  // 3. Open Guest Context to inspect modal and click "Open in Gmail"
  console.log('3. Opening guest browser context at /contact...');
  const guestContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "en-US",
    timezoneId: "Asia/Colombo",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  });
  const guestPage = await guestContext.newPage();

  await guestPage.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await guestPage.evaluate(() => {
    localStorage.setItem('ocean_air_cookie_consent', 'accepted');
  });

  // Track collect network requests
  let collectEventsCount = 0;
  guestPage.on('request', req => {
    if (req.url().includes('/api/v1/collect')) {
      const postData = req.postData();
      if (postData && postData.includes('email_click')) {
        collectEventsCount++;
        console.log(`🎯 [Request #${collectEventsCount}] /api/v1/collect email_click:`, postData);
      }
    }
  });

  await guestPage.goto('http://localhost:5173/contact', { waitUntil: "domcontentloaded" });
  await guestPage.waitForTimeout(1200);

  // 4. Click Email Us card
  console.log('4. Clicking "Email Us" card on /contact...');
  const contactCard = guestPage.locator('a.contact-bubbles-card:has-text("Email Us")').first();
  await contactCard.scrollIntoViewIfNeeded();
  await guestPage.waitForTimeout(400);
  await contactCard.click();
  await guestPage.waitForTimeout(800);

  // Verify modal opened
  const modalHeader = guestPage.locator('text="Send an Email"').first();
  await modalHeader.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✓ Modal is open!');

  // Verify "Open in Outlook" is GONE
  const outlookCount = await guestPage.locator('text="Open in Outlook"').count();
  console.log('Outlook option count (must be 0):', outlookCount);
  if (outlookCount !== 0) throw new Error(`"Open in Outlook" still found in modal (${outlookCount})!`);

  // Verify "Default Mail App" is GONE
  const defaultMailCount = await guestPage.locator('text="Default Mail App"').count();
  console.log('Default Mail App option count (must be 0):', defaultMailCount);
  if (defaultMailCount !== 0) throw new Error(`"Default Mail App" still found in modal (${defaultMailCount})!`);

  // Verify "Open in Gmail" exists
  const gmailButton = guestPage.locator('a:has-text("Open in Gmail")').first();
  await gmailButton.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✓ "Open in Gmail" option is verified present and prominent');

  // Screenshot streamlined modal
  const artifactDir = '/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397';
  const modalScreenshot = path.join(artifactDir, 'contact_email_modal_streamlined_verified.png');
  await guestPage.screenshot({ path: modalScreenshot, fullPage: false });
  console.log('📸 Saved modal screenshot:', modalScreenshot);

  // 5. Click "Open in Gmail" ONCE
  console.log('5. Clicking "Open in Gmail" button ONCE...');
  await gmailButton.click({ force: true }).catch(() => {});
  await guestPage.waitForTimeout(1500);

  console.log(`Total email_click requests sent by browser: ${collectEventsCount}`);

  // 6. Return to Admin Page and Refresh Statistics
  console.log('6. Refreshing admin statistics to verify EXACTLY +1 count...');
  await page.bringToFront();
  await page.waitForTimeout(1500);

  const refreshBtn = page.locator('button:has-text("Refresh Statistics"), button:has-text("Syncing")').first();
  if (await refreshBtn.isVisible()) {
    await refreshBtn.click();
  }

  // Poll for the exact incremented count (up to 10 seconds)
  let countAfter = countBefore;
  for (let attempt = 0; attempt < 10; attempt++) {
    await page.waitForTimeout(1000);
    const rawText = await emailCard.innerText();
    const match = rawText.match(/EMAIL INQUIRIES\s*(\d+)/i);
    const current = match ? parseInt(match[1], 10) : 0;
    if (current > countBefore) {
      countAfter = current;
      break;
    }
    // Re-click refresh if needed
    if (await refreshBtn.isVisible()) {
      await refreshBtn.click().catch(() => {});
    }
  }

  const rawTextAfter = await emailCard.innerText();
  console.log('--- Updated Email Card ---:\n', rawTextAfter);
  console.log(`Count Before: ${countBefore} -> Count After: ${countAfter}`);
  
  const diff = countAfter - countBefore;
  console.log(`Exact Count Difference: +${diff}`);

  if (diff !== 1) {
    throw new Error(`Expected exactly +1 increment, but got +${diff} (from ${countBefore} to ${countAfter})!`);
  }

  console.log('🎉 SUCCESS: Count incremented by EXACTLY ONE (+1)!');

  // Screenshot admin updated card
  const adminScreenshot = path.join(artifactDir, 'admin_visitors_email_single_increment_verified.png');
  await page.screenshot({ path: adminScreenshot, fullPage: false });
  console.log('📸 Saved admin screenshot:', adminScreenshot);

  await browser.close();
  console.log('🏁 All verifications passed with 100% precision!');
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
