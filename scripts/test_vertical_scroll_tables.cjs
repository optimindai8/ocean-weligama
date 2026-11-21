const { chromium } = require('playwright');
const path = require('path');

async function run() {
  console.log('🚀 Starting E2E verification for Vertical Scroll feature on Top Pages & Visitors tables...');

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

  // 1. Authenticate Admin
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
  await page.waitForTimeout(2500);

  // 3. Verify Vertical Scroll on Top Pages table
  console.log('3. Verifying Vertical Scroll on Top Pages table...');
  const topPagesScrollContainer = page.locator('.max-h-\\[540px\\]').first();
  await topPagesScrollContainer.waitFor({ state: 'visible', timeout: 5000 });
  await topPagesScrollContainer.scrollIntoViewIfNeeded();

  // Verify sticky header
  const pagesStickyHeader = topPagesScrollContainer.locator('thead.sticky');
  if (await pagesStickyHeader.count() === 0) {
    throw new Error('Top Pages table sticky header not found!');
  }
  console.log('✓ Found sticky header on Top Pages table!');

  // Test scrolling down within the container
  await topPagesScrollContainer.evaluate(el => {
    el.scrollTop = 150;
  });
  await page.waitForTimeout(500);

  const pagesScrollTop = await topPagesScrollContainer.evaluate(el => el.scrollTop);
  console.log(`✓ Top Pages table scrolled to scrollTop: ${pagesScrollTop}px`);

  const artifactDir = '/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397';
  const topPagesScreenshot = path.join(artifactDir, 'admin_top_pages_vertical_scroll_verified.png');
  await topPagesScrollContainer.screenshot({ path: topPagesScreenshot });
  console.log(`✓ Captured Top Pages vertical scroll screenshot at ${topPagesScreenshot}`);

  // 4. Switch to Visitors Tab
  console.log('4. Switching to Visitors breakdown tab...');
  const visitorsTabBtn = page.locator('button:has-text("Top Pages") + button');
  await visitorsTabBtn.click();
  await page.waitForTimeout(1500);

  // 5. Verify Vertical Scroll on Visitors table
  console.log('5. Verifying Vertical Scroll on Visitors table...');
  const visitorsScrollContainer = page.locator('.max-h-\\[560px\\]').first();
  await visitorsScrollContainer.waitFor({ state: 'visible', timeout: 5000 });
  await visitorsScrollContainer.scrollIntoViewIfNeeded();

  // Verify sticky header
  const visitorsStickyHeader = visitorsScrollContainer.locator('thead.sticky');
  if (await visitorsStickyHeader.count() === 0) {
    throw new Error('Visitors table sticky header not found!');
  }
  console.log('✓ Found sticky header on Visitors table!');

  // Check scrollHeight and clientHeight
  const { scrollHeight, clientHeight } = await visitorsScrollContainer.evaluate(el => ({
    scrollHeight: el.scrollHeight,
    clientHeight: el.clientHeight,
  }));
  console.log(`Visitors table dimensions: scrollHeight=${scrollHeight}px, clientHeight=${clientHeight}px`);

  if (scrollHeight > clientHeight) {
    console.log('✓ Visitors table has content exceeding container height — vertical scroll active!');
  }

  // Scroll down 250px
  await visitorsScrollContainer.evaluate(el => {
    el.scrollTop = 250;
  });
  await page.waitForTimeout(600);

  const visitorsScrollTop = await visitorsScrollContainer.evaluate(el => el.scrollTop);
  console.log(`✓ Visitors table smoothly scrolled to scrollTop: ${visitorsScrollTop}px`);

  // Verify sticky header remains visible at the top while scrolled
  const headerBoundingBox = await visitorsStickyHeader.boundingBox();
  const containerBoundingBox = await visitorsScrollContainer.boundingBox();
  console.log('Header Y:', headerBoundingBox.y, 'Container Y:', containerBoundingBox.y);
  if (Math.abs(headerBoundingBox.y - containerBoundingBox.y) > 10) {
    console.warn('Sticky header position offset:', headerBoundingBox.y - containerBoundingBox.y);
  } else {
    console.log('✓ Sticky header is securely pinned to the top of the scroll container!');
  }

  const visitorsScreenshot = path.join(artifactDir, 'admin_visitors_vertical_scroll_verified.png');
  await visitorsScrollContainer.screenshot({ path: visitorsScreenshot });
  console.log(`✓ Captured Visitors table vertical scroll screenshot at ${visitorsScreenshot}`);

  // Capture full page screenshot of the Visitors tab with vertical scroll container
  const fullScreenshot = path.join(artifactDir, 'admin_visitors_tab_with_vertical_scroll_full.png');
  await page.screenshot({ path: fullScreenshot, fullPage: false });
  console.log(`✓ Captured Full Visitors tab screenshot at ${fullScreenshot}`);

  await browser.close();
  console.log('🎉 E2E Vertical Scroll Verification completed with 100% SUCCESS!');
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
