import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  // Set localStorage token if needed, or just visit the page. We might need a token to see the admin page.
  await page.goto('http://localhost:5173/ow-admin');
  
  // Login if needed... wait, we can just inject the token.
  await page.evaluate(() => {
    localStorage.setItem('ow-admin-token', 'test-token');
  });
  
  await page.goto('http://localhost:5173/ow-admin/reviews');
  await page.waitForTimeout(3000);
  
  // Click on 'Approved' tab
  try {
    await page.getByText('Approved').click();
    await page.waitForTimeout(2000);
  } catch(e) {}
  
  await browser.close();
}

run().catch(console.error);
