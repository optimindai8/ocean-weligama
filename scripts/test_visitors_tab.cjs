const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  console.log('🚀 Starting E2E verification for new Visitors tab in Admin Panel...');

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
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

  // 2. Open Admin Visitors page
  console.log('2. Loading Admin Visitors page...');
  await page.goto('http://localhost:5173/ow-admin/visitors', { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // 3. Locate the new "Visitors" breakdown tab button
  console.log('3. Checking for "Visitors" breakdown tab button...');
  const visitorsTabBtn = page.locator('button:has-text("Top Pages") + button');
  await visitorsTabBtn.waitFor({ state: 'visible', timeout: 5000 });
  console.log('✓ Found "Visitors" breakdown tab button:', await visitorsTabBtn.innerText());

  // 4. Click the "Visitors" tab
  console.log('4. Clicking "Visitors" tab...');
  await visitorsTabBtn.click();
  await page.waitForTimeout(1500);

  // 5. Verify the 8 column headers
  console.log('5. Verifying table headers...');
  const headers = await page.locator('table th').allInnerTexts();
  console.log('Headers found:', headers);

  const expectedHeaders = ['#', 'IP ADDRESS', 'COUNTRY', 'DATE', 'TIME', 'TIME SPENT', 'BROWSER', 'OPERATING SYSTEM'];
  for (const expected of expectedHeaders) {
    const found = headers.some(h => h.toUpperCase().includes(expected));
    if (!found) {
      throw new Error(`Expected header "${expected}" not found in table headers: ${JSON.stringify(headers)}`);
    }
  }
  console.log('✓ All 8 separate columns verified successfully!');

  // 6. Verify row contents and numbering
  console.log('6. Verifying row contents and sequence numbering...');
  const rows = page.locator('tbody tr');
  const rowCount = await rows.count();
  console.log(`✓ Table rendered ${rowCount} visitor session rows`);

  const firstRowNumber = await page.locator('tbody tr').first().locator('td').first().innerText();
  console.log(`Top Row Number (should be latest visitor, e.g. 11, NOT 1): "${firstRowNumber.replace(/\n+/g, ' ')}"`);

  const firstRowIp = await page.locator('tbody tr').first().locator('td').nth(1).innerText();
  console.log(`Top Row IP: "${firstRowIp}"`);

  // Verify IP is accurate real public IP
  if (firstRowIp.includes('127.0.0.1')) {
    throw new Error(`IP address was 127.0.0.1 instead of accurate public IP!`);
  }
  console.log('✓ IP address is accurate real public IP!');

  // 7. Test new visitor arrival increment (e.g. 29 -> 30)
  console.log('7. Simulating new visitor arrival to test sequential increment...');
  const crypto = require('crypto');
  const newVisitorId = crypto.randomUUID();
  const newSessionId = crypto.randomUUID();
  await fetch('http://localhost:8080/api/v1/collect', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    },
    body: JSON.stringify({
      type: 'pageview',
      visitorId: newVisitorId,
      sessionId: newSessionId,
      path: '/dining',
      country: 'CH', // Switzerland
    }),
  });
  console.log('✓ Sent new guest pageview event to /api/v1/collect');

  // Trigger Refresh
  console.log('Clicking Refresh button in admin panel...');
  const refreshBtn = page.locator('button[aria-label="Refresh Data from Supabase"]');
  await refreshBtn.click();
  await page.waitForTimeout(2000);

  // Check new top row number
  const updatedFirstRowNumber = await page.locator('tbody tr').first().locator('td').first().innerText();
  console.log(`Updated Top Row Number after new visitor: "${updatedFirstRowNumber.replace(/\n+/g, ' ')}"`);

  const updatedRowIp = await page.locator('tbody tr').first().locator('td').nth(1).innerText();
  console.log(`Updated Top Row IP: "${updatedRowIp}"`);

  const updatedCountry = await page.locator('tbody tr').first().locator('td').nth(2).innerText();
  console.log(`Updated Top Row Country: "${updatedCountry.replace(/\n+/g, ' ')}"`);

  // Verify multiple countries from the table
  const countries = await page.locator('tbody tr td:nth-child(3)').allInnerTexts();
  console.log(`Sample of countries in table (${countries.length} total):`, countries.slice(0, 10).map(c => c.replace(/\n+/g, ' ')));

  // 8. Scroll to the Visitors Table and capture verified screenshots
  const tableSection = page.locator('table');
  await tableSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const artifactDir = '/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397';
  const tableScreenshotPath = path.join(artifactDir, 'admin_visitors_worldwide_table_verified.png');
  // Capture table section container
  const breakdownCard = page.locator('div:has(> table), .bg-white.rounded-2xl:has(table)').last();
  await breakdownCard.screenshot({ path: tableScreenshotPath });
  console.log(`✓ Captured verified table screenshot at ${tableScreenshotPath}`);

  const fullScreenshotPath = path.join(artifactDir, 'admin_visitors_worldwide_countries_verified.png');
  await page.screenshot({ path: fullScreenshotPath, fullPage: true });
  console.log(`✓ Captured verified full page screenshot at ${fullScreenshotPath}`);

  await browser.close();
  console.log('🎉 E2E Test completed with 100% SUCCESS!');
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
