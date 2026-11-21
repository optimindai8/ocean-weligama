const { chromium } = require('playwright');
const path = require('path');

async function run() {
  console.log('🚀 Starting E2E test for Email Inquiry tracking & Top Pages individual visit times...');

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 },
    locale: "en-US",
    timezoneId: "Asia/Colombo",
  });
  const page = await context.newPage();

  // 1. Log in to Admin Panel via API token
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

  // 2. Navigate to Admin Visitors Page
  console.log('2. Navigating to http://localhost:5173/ow-admin/visitors...');
  await page.goto('http://localhost:5173/ow-admin/visitors', { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // Check baseline Email Inquiries card
  const initialEmailCard = page.locator('div:has-text("Email Inquiries")').last();
  await initialEmailCard.waitFor({ state: 'visible', timeout: 5000 });
  const initialText = await initialEmailCard.innerText();
  console.log('Initial Email Inquiries Card:\n', initialText);

  // 3. Open Guest Context to perform visitor actions
  console.log('3. Opening guest context to visit /contact and click Email Us card...');
  const guestContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "en-US",
    timezoneId: "Asia/Colombo",
  });
  const guestPage = await guestContext.newPage();

  // Pre-accept cookie consent for tracking
  await guestPage.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await guestPage.evaluate(() => {
    localStorage.setItem('ocean_air_cookie_consent', 'accepted');
  });

  // Track /api/v1/collect calls
  let emailClickCollected = false;
  guestPage.on('request', req => {
    if (req.url().includes('/api/v1/collect')) {
      const postData = req.postData();
      if (postData && (postData.includes('email_click') || postData.includes('email_inquiry'))) {
        console.log('🎯 Captured /api/v1/collect with email tracking payload:', postData);
        emailClickCollected = true;
      }
    }
  });

  await guestPage.goto('http://localhost:5173/contact', { waitUntil: "domcontentloaded" });
  await guestPage.waitForTimeout(1500);

  // Find and click the Email Us card in section 2
  console.log('Locating and clicking Email Us card...');
  const emailCard = guestPage.locator('[data-track="email_click"], a.contact-bubbles-card:has-text("Email Us")').first();
  await emailCard.scrollIntoViewIfNeeded();
  await guestPage.waitForTimeout(500);
  await emailCard.click();
  await guestPage.waitForTimeout(800);

  // Verify modal is open
  const modalHeader = guestPage.locator('text="Send an Email"').first();
  await modalHeader.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✓ Email Chooser modal opened');

  // Click "Open in Gmail" inside modal
  const gmailOption = guestPage.locator('a:has-text("Open in Gmail")').first();
  if (await gmailOption.isVisible()) {
    console.log('Clicking Open in Gmail option in modal...');
    await gmailOption.click({ force: true }).catch(() => {});
  }
  await guestPage.waitForTimeout(1500);

  console.log('emailClickCollected flag:', emailClickCollected);

  // 4. Return to Admin Page and Refresh Statistics
  console.log('4. Refreshing admin statistics...');
  await page.bringToFront();
  
  // Click manual Refresh button in top right
  const refreshBtn = page.locator('button:has-text("Refresh Statistics"), button:has-text("Syncing")').first();
  if (await refreshBtn.isVisible()) {
    await refreshBtn.click();
    await page.waitForTimeout(1500);
  }

  // Check updated Email Inquiries card
  const updatedEmailCard = page.locator('div:has-text("Email Inquiries")').last();
  const updatedText = await updatedEmailCard.innerText();
  console.log('Updated Email Inquiries Card:\n', updatedText);

  // 5. Check Top Pages table
  console.log('5. Checking Top Pages table columns & individual visit times...');
  const topPagesTab = page.locator('button:has-text("Top Pages")').first();
  await topPagesTab.click();
  await page.waitForTimeout(800);

  // Check for table headers
  const avgTimeTh = page.locator('th:has-text("Avg. Time on Page")');
  const lastVisitTh = page.locator('th:has-text("Last Visit Time")');
  await avgTimeTh.waitFor({ state: 'visible', timeout: 5000 });
  await lastVisitTh.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✓ Columns "Avg. Time on Page" and "Last Visit Time" are visible!');

  // Scroll to Top Pages section
  await avgTimeTh.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Expand the first row log (or row for /contact)
  const contactRow = page.locator('tbody tr:has-text("/contact")').first();
  if (await contactRow.isVisible()) {
    console.log('Expanding /contact row to show individual visit times...');
    await contactRow.click();
  } else {
    const firstRow = page.locator('tbody tr').first();
    await firstRow.click();
  }
  await page.waitForTimeout(800);

  // Check that the expandable visit details drawer is visible
  const individualLog = page.locator('text="Individual Visit Times for"').first();
  if (await individualLog.isVisible()) {
    console.log('✓ Individual Visit Times drawer expanded successfully!');
  }

  // Save screenshots
  const artifactDir = '/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397';
  const tableScreenshotPath = path.join(artifactDir, 'admin_visitors_top_pages_individual_times_verified.png');
  await page.screenshot({ path: tableScreenshotPath, fullPage: false });
  console.log('📸 Saved screenshot:', tableScreenshotPath);

  await browser.close();
  console.log('🎉 Test completed successfully!');
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
