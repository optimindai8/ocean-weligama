const { chromium } = require("playwright");

async function main() {
  console.log("1. Authenticating via API to get real JWT...");
  const loginRes = await fetch("http://localhost:8080/api/v1/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@oceanweligama.com", password: "OceanAdmin2025!" }),
  });
  const { token } = await loginRes.json();
  console.log("✓ Acquired real admin token:", !!token);

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 },
    locale: "en-US",
    timezoneId: "Asia/Colombo",
  });

  // Inject real admin token into localStorage
  await context.addInitScript((jwt) => {
    localStorage.setItem("ow-admin-token", jwt);
  }, token);

  const page = await context.newPage();

  console.log("2. Navigating to Admin Blogs page...");
  await page.goto("http://localhost:5173/ow-admin/blogs");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);

  // Pick the second blog (Weligama Surf Guide)
  const editButtons = page.locator('button:has-text("Edit Story")');
  const count = await editButtons.count();
  console.log(`Found ${count} "Edit Story" buttons.`);
  
  // Click edit on the second blog
  await editButtons.nth(1).click();
  console.log("Clicked 'Edit Story' button on second blog.");

  await page.waitForSelector('#description', { state: "visible", timeout: 5000 });
  const titleVal = await page.inputValue('#title');
  const originalDesc = await page.inputValue('#description');
  console.log(`Editing blog: "${titleVal}" (length: ${originalDesc.length})`);

  // Sample table to paste
  const tableContent = `
### Weligama Bay Seasonal Surf & Conditions Guide

Here is our seasonal surf guide breakdown:

| Weligama Surf Season | Recommended Months | Wave Swell Height | Ideal Skill Level |
| --- | --- | --- | --- |
| Main Bay Season | November – April | 2 – 5 Feet (Clean & Glassy) | Beginner to Advanced |
| Mid-Year Monsoon | May – September | 4 – 8 Feet (Power Reef Breaks) | Intermediate & Pro |
| Shoulder Windows | October – November | 3 – 6 Feet (Gentle Longboarders) | All Experience Levels |

Whether you are paddling out for your very first wave or seeking dawn barrels, our certified instructors ensure you catch the best sets safely.
`;

  const updatedDesc = originalDesc + "\n\n" + tableContent;
  await page.fill('#description', updatedDesc);
  console.log("Pasted table content into story description.");

  // Click Save Changes
  const saveBtn = page.locator('button:has-text("Save Changes")');
  await saveBtn.click();
  console.log("Clicked 'Save Changes'.");

  await page.waitForSelector('#description', { state: "hidden", timeout: 8000 });
  console.log("Saved and dialog closed!");
  await page.waitForTimeout(1000);

  // Fetch blog ID
  const blogsRes = await fetch("http://localhost:8080/api/v1/blogs");
  const blogsList = await blogsRes.json();
  const targetBlog = blogsList.find(b => b.title === titleVal);
  console.log(`Target blog ID: ${targetBlog.id}`);

  // 3. Navigate directly to public blog detail page
  console.log(`3. Navigating to public blog page: http://localhost:5173/blog/${targetBlog.id}`);
  await page.goto(`http://localhost:5173/blog/${targetBlog.id}`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  // Scroll down towards content
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(1000);

  // Verify Table Elements on Page
  const tableContainer = page.locator('[data-testid="story-table-container"]');
  const tableCount = await tableContainer.count();
  console.log(`Found story table containers: ${tableCount}`);

  if (tableCount === 0) {
    throw new Error("FAIL: Table container [data-testid='story-table-container'] not found on public blog page!");
  }

  // Check headers in the table
  const ths = await page.locator('[data-testid="story-table-container"] th').allTextContents();
  console.log("Table headers rendered:", ths);
  if (!ths.some(h => h.includes("Weligama Surf Season")) || !ths.some(h => h.includes("Ideal Skill Level"))) {
    throw new Error("FAIL: Expected table headers not found!");
  }

  // Check rows in the table
  const tds = await page.locator('[data-testid="story-table-container"] td').allTextContents();
  console.log(`Table cell count: ${tds.length}. First 4 cells:`, tds.slice(0, 4));
  if (!tds.some(c => c.includes("Main Bay Season")) || !tds.some(c => c.includes("November – April"))) {
    throw new Error("FAIL: Expected table row data not found!");
  }

  // Scroll directly to the table and capture screenshot
  await tableContainer.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const screenshotPath = "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/blog_table_rendered_verified.png";
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`✓ Screenshot of rendered table saved to: ${screenshotPath}`);

  // 4. Clean restoration: Revert back original description
  console.log("4. Cleanly reverting blog back to original content...");
  await page.goto("http://localhost:5173/ow-admin/blogs");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);

  await editButtons.nth(1).click();
  await page.waitForSelector('#description', { state: "visible", timeout: 5000 });
  await page.fill('#description', originalDesc);
  await page.locator('button:has-text("Save Changes")').click();
  await page.waitForSelector('#description', { state: "hidden", timeout: 8000 });
  console.log("Reverted and saved!");

  console.log("✓ ALL TABLE RENDERING TESTS PASSED WITH 100% SUCCESS!");
  await browser.close();
}

main().catch(err => {
  console.error("Test error:", err);
  process.exit(1);
});
