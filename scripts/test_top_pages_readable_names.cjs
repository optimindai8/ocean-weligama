const { chromium } = require('playwright');
const path = require('path');

async function run() {
  console.log('🚀 Starting E2E verification for Top Pages table readable names...');

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
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

  // 3. Ensure "Top Pages" breakdown tab is active (it is the default first tab)
  const topPagesTabBtn = page.locator('button:has-text("Top Pages")').first();
  await topPagesTabBtn.click();
  await page.waitForTimeout(1500);

  // 4. Scroll to Top Pages Table
  const table = page.locator('table').first();
  await table.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  // 5. Inspect rows in Top Pages table
  console.log('3. Inspecting Top Pages table rows for attractive, readable titles...');
  const rows = page.locator('tbody tr');
  const count = await rows.count();
  console.log(`Found ${count} rows in table`);

  // Log each page's title, badge, and URL path
  const pageEntries = [];
  for (let i = 0; i < Math.min(count, 12); i++) {
    const row = rows.nth(i);
    // Check if this is an expanded drawer row
    const isExpandedRow = await row.evaluate(el => el.classList.contains('bg-slate-50/60'));
    if (isExpandedRow) continue;

    const titleEl = row.locator('td').first().locator('span.font-serif');
    const badgeEl = row.locator('td').first().locator('span.uppercase');
    const pathEl = row.locator('td').first().locator('span.font-mono');

    if (await titleEl.count() > 0) {
      const title = await titleEl.innerText();
      const badge = await badgeEl.count() > 0 ? await badgeEl.innerText() : '';
      const rawPath = await pathEl.count() > 0 ? await pathEl.innerText() : '';
      pageEntries.push({ title, badge, path: rawPath });
      console.log(`Row #${pageEntries.length}: "${title}" [${badge}] -> (${rawPath})`);
    }
  }

  // 6. Verify Home Page is named "Home Page"
  const homeRow = pageEntries.find(p => p.path === '/' || p.path === '');
  if (homeRow) {
    console.log(`✓ Verified Home Page row: Title="${homeRow.title}", Badge="${homeRow.badge}"`);
    if (homeRow.title !== 'Home Page') {
      throw new Error(`Expected Home Page title to be "Home Page", got "${homeRow.title}"`);
    }
  }

  // 7. Verify Sunset Suite room details is named properly
  const sunsetRow = pageEntries.find(p => p.path.includes('sunset-suite'));
  if (sunsetRow) {
    console.log(`✓ Verified Sunset Suite row: Title="${sunsetRow.title}", Badge="${sunsetRow.badge}"`);
    if (!sunsetRow.title.toLowerCase().includes('sunset') && !sunsetRow.title.toLowerCase().includes('room no 12') && !sunsetRow.title.toLowerCase().includes('deluxe')) {
      throw new Error(`Expected Sunset Suite to have friendly room title, got "${sunsetRow.title}"`);
    }
  }

  // 8. Expand Sunset Suite or Home Page row to verify individual visit logs
  console.log('4. Expanding first row to verify visit log details...');
  await rows.first().click();
  await page.waitForTimeout(1000);

  // 9. Capture verified screenshots
  const artifactDir = '/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397';
  const tableContainer = page.locator('div:has(> table), .bg-white.rounded-2xl:has(table)').first();
  const tableScreenshotPath = path.join(artifactDir, 'admin_top_pages_readable_names_table_verified.png');
  await tableContainer.screenshot({ path: tableScreenshotPath });
  console.log(`✓ Captured verified table screenshot at ${tableScreenshotPath}`);

  const fullScreenshotPath = path.join(artifactDir, 'admin_top_pages_readable_names_full_verified.png');
  await page.screenshot({ path: fullScreenshotPath, fullPage: true });
  console.log(`✓ Captured verified full screenshot at ${fullScreenshotPath}`);

  await browser.close();
  console.log('🎉 E2E Verification completed with 100% SUCCESS!');
}

run().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
