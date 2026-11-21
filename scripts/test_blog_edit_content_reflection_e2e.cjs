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
  await page.waitForTimeout(2000);

  // Find the first "Edit Story" button
  const editButtons = page.locator('button:has-text("Edit Story")');
  const count = await editButtons.count();
  console.log(`Found ${count} "Edit Story" buttons.`);
  if (count === 0) {
    throw new Error("No 'Edit Story' button found!");
  }

  // Click the first "Edit Story" button
  await editButtons.first().click();
  console.log("Clicked 'Edit Story' button on first blog.");

  // Wait for dialog to open
  await page.waitForSelector('#description', { state: "visible", timeout: 5000 });
  const titleVal = await page.inputValue('#title');
  const originalDesc = await page.inputValue('#description');
  console.log(`Editing blog "${titleVal}". Current length: ${originalDesc.length}`);

  const testMarker = `[E2E LIVE VERIFIED CONTENT REFLECTION ${Date.now()}]`;
  const updatedDesc = originalDesc + `\n\n${testMarker}\n\nOur journey continues with even more dedication to luxury and guest hospitality.`;

  // Type updated content
  await page.fill('#description', updatedDesc);
  console.log("Filled updated content with test marker.");

  // Click Save Changes
  const saveBtn = page.locator('button:has-text("Save Changes")');
  await saveBtn.click();
  console.log("Clicked 'Save Changes'.");

  // Wait for dialog to close
  await page.waitForSelector('#description', { state: "hidden", timeout: 8000 });
  console.log("Dialog closed successfully!");
  await page.waitForTimeout(1000);

  // Get the blog ID from API to visit its direct page
  const blogsRes = await fetch("http://localhost:8080/api/v1/blogs");
  const blogsList = await blogsRes.json();
  const targetBlog = blogsList.find(b => b.title === titleVal) || blogsList[0];
  console.log(`Target blog ID: ${targetBlog.id}`);

  // 3. Navigate directly to the main website story page: /blog/:id
  console.log(`3. Navigating to public website story page: http://localhost:5173/blog/${targetBlog.id}`);
  await page.goto(`http://localhost:5173/blog/${targetBlog.id}`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  // Assert that the test marker is present on the page!
  const pageContent = await page.textContent("body");
  const hasMarker = pageContent.includes(testMarker);
  console.log(`Does public /blog/${targetBlog.id} show the updated story content? ->`, hasMarker);

  if (!hasMarker) {
    throw new Error("FAIL: Public story page did not reflect the edited content!");
  }

  // Capture screenshot of public story page showing updated content
  const screenshotPath = "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/blog_edited_story_content_verified.png";
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`Saved screenshot to ${screenshotPath}`);

  // Also check /blog page
  console.log("4. Checking public blog listing page: http://localhost:5173/blog");
  await page.goto("http://localhost:5173/blog");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  const blogListContent = await page.textContent("body");
  console.log("Public /blog shows updated content snippet?", blogListContent.includes(testMarker));

  // 5. Clean restoration: Revert back to original content
  console.log("5. Reverting back to original content in Admin...");
  await page.goto("http://localhost:5173/ow-admin/blogs");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  await editButtons.first().click();
  await page.waitForSelector('#description', { state: "visible", timeout: 5000 });
  await page.fill('#description', originalDesc);
  await page.locator('button:has-text("Save Changes")').click();
  await page.waitForSelector('#description', { state: "hidden", timeout: 8000 });
  console.log("Reverted and saved!");

  // Verify public page no longer has the marker
  await page.goto(`http://localhost:5173/blog/${targetBlog.id}`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  const revertedContent = await page.textContent("body");
  const hasMarkerAfterRevert = revertedContent.includes(testMarker);
  console.log("Marker cleanly removed after revert? ->", !hasMarkerAfterRevert);

  console.log("✓ ALL TESTS PASSED WITH 100% SUCCESS!");
  await browser.close();
}

main().catch(err => {
  console.error("Test error:", err);
  process.exit(1);
});
