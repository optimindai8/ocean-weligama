const { chromium } = require("playwright");

async function run() {
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

  const loginRes = await fetch("http://localhost:8080/api/v1/admin/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "admin@oceanweligama.com", password: "OceanAdmin2025!" }),
  });
  const { token } = await loginRes.json();

  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await page.evaluate((tok) => {
    localStorage.setItem("ow-admin-token", tok);
  }, token);

  await page.goto("http://localhost:5173/ow-admin/visitors", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // Check that the sentence is nowhere on the page
  const count = await page.locator('text="Hourly breakdown of unique visitors and requested pages today"').count();
  console.log("Count of removed sentence (must be 0):", count);
  if (count > 0) throw new Error("Sentence still found on page!");

  await page.screenshot({
    path: "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/admin_visitors_clean_chart_verified.png",
    fullPage: false,
  });
  console.log("✔ Saved admin_visitors_clean_chart_verified.png");

  await browser.close();
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
