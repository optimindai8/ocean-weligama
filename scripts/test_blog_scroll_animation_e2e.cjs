const { chromium } = require("playwright");

async function main() {
  console.log("1. Launching browser to test blog detail scroll animation...");
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

  // 2. Navigate directly to blog detail page
  const targetId = "e7dece7c-7879-4c7b-89e6-ecfe1265f4c4";
  console.log(`2. Navigating to http://localhost:5173/blog/${targetId}...`);
  await page.goto(`http://localhost:5173/blog/${targetId}`);
  await page.waitForLoadState("networkidle");
  console.log("Loaded blog detail page!");

  // Initially user is at top of page (scrollY === 0, Hero is in view)
  const initialScrollY = await page.evaluate(() => window.scrollY);
  console.log("Initial scrollY at page top:", initialScrollY);

  // Scroll slightly to reach the top of the content section (about 450px)
  console.log("3. Scrolling 450px to reach the content section top...");
  await page.evaluate(() => window.scrollBy(0, 450));
  await page.waitForTimeout(600); // 0.55s duration

  // Check the Typography Content Card
  const contentCard = page.locator('.relative.bg-\\[\\#FCFDFE\\]\\/98');
  await contentCard.waitFor({ state: "visible", timeout: 3000 });

  const isVisible = await contentCard.isVisible();
  console.log("Is Typography Content Card visible right at content top?", isVisible);

  const opacity = await contentCard.evaluate((el) => {
    const parentMotion = el.closest('.relative');
    const style = window.getComputedStyle(parentMotion || el);
    return style.opacity;
  });
  console.log("Computed opacity of content section at top:", opacity);

  if (!isVisible || parseFloat(opacity) < 0.8) {
    throw new Error(`FAIL: Content card not fully visible at top of content (opacity=${opacity})!`);
  }

  // Check that the top paragraph text inside is immediately visible
  const firstParagraph = page.locator('.relative.bg-\\[\\#FCFDFE\\]\\/98 p').first();
  const pVisible = await firstParagraph.isVisible();
  const pText = (await firstParagraph.textContent()) || "";
  console.log("Is top paragraph inside the card visible immediately?", pVisible, `("${pText.slice(0, 45)}...")`);

  if (!pVisible || !pText) {
    throw new Error("FAIL: Top paragraph inside content card is not immediately visible!");
  }

  // Capture screenshot of the content card beautifully animated at content top
  const screenshotPath = "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/blog_content_top_animation_verified.png";
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`✓ Saved screenshot of quick top content animation: ${screenshotPath}`);

  console.log("✓ ALL SCROLL ANIMATION TESTS PASSED WITH 100% SUCCESS!");
  await browser.close();
}

main().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
