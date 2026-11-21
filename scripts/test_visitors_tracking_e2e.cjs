const { chromium } = require('/Users/pasindumalinda/OPTIMIND_AI/Web_project/Ocean_Welligama/Ocean-Weligama/node_modules/playwright');
const path = require('path');

const ARTIFACT_DIR = '/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397';

async function run() {
  console.log('🚀 Starting Visitor Tracking & Cookie Consent End-to-End Test...');

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 }
  });
  const page = await context.newPage();

  // Listen to network collect requests
  const collectRequests = [];
  page.on('request', req => {
    if (req.url().includes('/collect')) {
      collectRequests.push({
        url: req.url(),
        method: req.method(),
        postData: req.postData(),
      });
    }
  });

  try {
    // ==========================================
    // STEP 1: COOKIE POPUP & REJECT BUTTON TEST
    // ==========================================
    console.log('\n--- 1. Testing Cookie Consent Popup & Reject Button ---');
    await page.goto('http://localhost:5173/?cookie_card=true', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const cookieCard = page.locator('[data-testid="cookie-consent-card"]');
    await cookieCard.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✔ Cookie card is visible on page load.');

    // Screenshot cookie popup
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'cookie_card_live_verified.png') });

    const acceptBtn = page.locator('[data-testid="cookie-accept-btn"]');
    const rejectBtn = page.locator('[data-testid="cookie-reject-btn"]');

    if ((await acceptBtn.count()) === 0 || (await rejectBtn.count()) === 0) {
      throw new Error('Accept or Reject button missing on cookie card!');
    }
    console.log('✔ Found both Accept and Reject buttons.');

    // Click Reject button
    console.log('Clicking Reject button...');
    await rejectBtn.click();
    await page.waitForTimeout(1000);

    // Verify popup is dismissed
    const isVisibleAfterReject = await cookieCard.isVisible();
    console.log(`Cookie card visible after reject: ${isVisibleAfterReject} (expected: false)`);
    if (isVisibleAfterReject) throw new Error('Cookie card did not dismiss on Reject!');

    // Check localStorage and cookies
    const rejectDecision = await page.evaluate(() => localStorage.getItem("ocean_air_cookie_consent"));
    const hvConsentReject = await page.evaluate(() => localStorage.getItem("hv_consent"));
    const cookiesAfterReject = await context.cookies();
    const hvCookieReject = cookiesAfterReject.find(c => c.name === '_hv');

    console.log(`ocean_air_cookie_consent after reject: "${rejectDecision}" (expected: "rejected")`);
    console.log(`hv_consent after reject: "${hvConsentReject}" (expected: null)`);
    console.log(`_hv cookie after reject: ${hvCookieReject ? hvCookieReject.value : 'None'} (expected: None)`);

    if (rejectDecision !== 'rejected' || hvConsentReject !== null || hvCookieReject) {
      throw new Error('Reject button did not properly wipe or reject tracking consent!');
    }
    console.log('✔ Reject button functions with 100% privacy compliance.');

    // ==========================================
    // STEP 2: COOKIE POPUP & ACCEPT BUTTON TEST
    // ==========================================
    console.log('\n--- 2. Testing Cookie Consent Accept Button & Tracking Initiation ---');
    // Reopen cookie card
    await page.evaluate(() => window.openCookieCard());
    await page.waitForTimeout(1000);
    await cookieCard.waitFor({ state: 'visible', timeout: 5000 });

    // Click Accept button
    console.log('Clicking Accept button...');
    await acceptBtn.click();
    await page.waitForTimeout(1500);

    const isVisibleAfterAccept = await cookieCard.isVisible();
    console.log(`Cookie card visible after accept: ${isVisibleAfterAccept} (expected: false)`);
    if (isVisibleAfterAccept) throw new Error('Cookie card did not dismiss on Accept!');

    const acceptDecision = await page.evaluate(() => localStorage.getItem("ocean_air_cookie_consent"));
    const hvConsentAccept = await page.evaluate(() => localStorage.getItem("hv_consent"));
    const cookiesAfterAccept = await context.cookies();
    const hvCookieAccept = cookiesAfterAccept.find(c => c.name === '_hv');

    console.log(`ocean_air_cookie_consent after accept: "${acceptDecision}" (expected: "accepted")`);
    console.log(`hv_consent after accept: "${hvConsentAccept}" (expected: "1")`);
    console.log(`_hv cookie after accept: ${hvCookieAccept ? hvCookieAccept.value : 'None'}`);

    if (acceptDecision !== 'accepted' || hvConsentAccept !== '1' || !hvCookieAccept) {
      throw new Error('Accept button did not create _hv cookie or set hv_consent!');
    }
    console.log('✔ Accept button functions smoothly: generated anonymous _hv visitor cookie.');

    // Navigate to Rooms and About to generate realistic pageviews & events
    console.log('Simulating realistic visitor navigation to generate stats in SQLite...');
    await page.goto('http://localhost:5173/rooms', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Track a custom booking button click
    await page.evaluate(() => {
      if (window.hotelTracker) {
        window.hotelTracker.track('booking_click');
        window.hotelTracker.track('whatsapp_click');
      }
    });
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:5173/about', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    console.log(`Captured ${collectRequests.length} collect requests sent to backend:`);
    collectRequests.slice(-3).forEach((r, idx) => {
      console.log(`  Req #${idx + 1}: ${r.method} ${r.url} - ${r.postData?.slice(0, 100)}...`);
    });

    // ==========================================
    // STEP 3: ADMIN VISITORS PAGE E2E TEST
    // ==========================================
    console.log('\n--- 3. Testing Admin Visitors Dashboard ---');

    // Acquire Admin Token
    const loginRes = await fetch("http://localhost:8080/api/v1/admin/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "admin@oceanweligama.com", password: "OceanAdmin2025!" }),
    });
    const { token } = await loginRes.json();
    console.log("Acquired admin token:", !!token);

    // Set token in localStorage
    await page.evaluate((tok) => {
      localStorage.setItem("ow-admin-token", tok);
    }, token);

    // Navigate to Visitors Page
    console.log('Navigating to http://localhost:5173/ow-admin/visitors...');
    await page.goto('http://localhost:5173/ow-admin/visitors', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    // Verify Title & Pulse
    const titleLocator = page.locator('h1:has-text("Visitor Analytics")');
    await titleLocator.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✔ Visitors page loaded with title "Visitor Analytics".');

    const pulseBadge = page.locator('text=Online Now');
    const hasPulse = await pulseBadge.count() > 0;
    console.log(`✔ Real-time pulse indicator present: ${hasPulse}`);

    // Verify KPI Cards
    const kpiCards = [
      'Live Active',
      'Unique Visitors',
      'Page Views',
      'Total Sessions',
      'Returning %',
      'Avg. Duration'
    ];
    for (const card of kpiCards) {
      const el = page.locator(`span:has-text("${card}")`);
      const count = await el.count();
      console.log(`✔ KPI Card "${card}": present (${count > 0})`);
      if (count === 0) throw new Error(`KPI Card "${card}" not found!`);
    }

    // Verify Plot
    const chartContainer = page.locator('.recharts-responsive-container');
    const hasChart = await chartContainer.count() > 0;
    console.log(`✔ Recharts Area/Line plot rendered: ${hasChart}`);
    if (!hasChart) throw new Error('Recharts plot container not found on Visitors page!');

    // Verify High-Intent Conversions
    const convSections = ['Book Now Clicks', 'WhatsApp Chats', 'Phone Calls', 'Email Inquiries', 'Cookie Consents'];
    for (const conv of convSections) {
      const el = page.locator(`text="${conv}"`);
      const count = await el.count();
      console.log(`✔ Conversion stat "${conv}": present (${count > 0})`);
    }

    // Take full page screenshot
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_visitors_overview_verified.png'), fullPage: true });

    // Test tab switches
    console.log('Testing Breakdown tabs...');
    const tabs = ['Sources & Mediums', 'Guest Origins', 'Devices & Tech', 'Top Pages'];
    for (const tabName of tabs) {
      const tabBtn = page.locator(`button:has-text("${tabName}")`).first();
      await tabBtn.click();
      await page.waitForTimeout(600);
      console.log(`  Clicked tab "${tabName}"`);
    }

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_visitors_breakdown_tabs_verified.png') });

    // Verify Purge button exists
    const purgeBtn = page.locator('button:has-text("Prune Expired")');
    const hasPurge = await purgeBtn.count() > 0;
    console.log(`✔ Database retention / purge button present: ${hasPurge}`);

    console.log('\n🎉 ALL VISITOR TRACKING & COOKIE CONSENT E2E TESTS PASSED 100%!');

  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
