const { chromium } = require("playwright");

async function run() {
  console.log("🚀 Starting E2E verification: Cookie Reject button MUST collect visitor telemetry...");

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 },
    locale: "en-US",
  });

  const page = await context.newPage();

  // Monitor network requests to /api/v1/collect
  const collectRequests = [];
  page.on("request", (req) => {
    if (req.url().includes("/api/v1/collect")) {
      try {
        const postData = JSON.parse(req.postData() || "{}");
        collectRequests.push({ url: req.url(), data: postData });
        console.log(`📡 Beacon sent to /api/v1/collect: type="${postData.type}", name="${postData.name || ''}", path="${postData.path}"`);
      } catch (e) {
        collectRequests.push({ url: req.url(), raw: req.postData() });
      }
    }
  });

  // 1. Visit website with clean storage
  console.log("1. Visiting website as a new guest...");
  await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  // 2. Locate the Cookie Consent card
  console.log("2. Waiting for Cookie Consent card...");
  const cookieCard = page.locator('[data-testid="cookie-consent-card"]');
  await cookieCard.waitFor({ state: "visible", timeout: 6000 });
  console.log("✓ Cookie Consent card is visible!");

  // 3. Locate and click the Reject button
  const rejectBtn = page.locator('[data-testid="cookie-reject-btn"]');
  await rejectBtn.waitFor({ state: "visible", timeout: 3000 });
  console.log("3. Clicking 'Reject' button...");
  await rejectBtn.click();
  await page.waitForTimeout(1200);

  // Verify popup is dismissed
  await cookieCard.waitFor({ state: "hidden", timeout: 3000 });
  console.log("✓ Cookie Consent popup dismissed!");

  // Verify localStorage contains rejected
  const storedConsent = await page.evaluate(() => localStorage.getItem("ocean_air_cookie_consent"));
  console.log(`✓ Stored consent in localStorage: "${storedConsent}"`);
  if (storedConsent !== "rejected") {
    throw new Error(`Expected ocean_air_cookie_consent to be "rejected", got "${storedConsent}"`);
  }

  // Verify tracker is running
  const isTrackerRunning = await page.evaluate(() => {
    return window.hotelTracker && typeof window.hotelTracker.track === "function";
  });
  if (!isTrackerRunning) {
    throw new Error("window.hotelTracker is not active!");
  }
  console.log("✓ window.hotelTracker is active and running!");

  // Verify that pageview and cookie_consent_rejected beacon requests were delivered
  const hasPageview = collectRequests.some((r) => r.data && r.data.type === "pageview");
  const hasRejectedEvent = collectRequests.some((r) => r.data && r.data.name === "cookie_consent_rejected");

  console.log(`✓ Collected requests count: ${collectRequests.length}`);
  console.log(`✓ Has pageview beacon: ${hasPageview}`);
  console.log(`✓ Has cookie_consent_rejected event: ${hasRejectedEvent}`);

  if (!hasPageview) {
    throw new Error("Pageview was NOT collected after clicking Reject!");
  }
  if (!hasRejectedEvent) {
    throw new Error("Event 'cookie_consent_rejected' was NOT collected after clicking Reject!");
  }

  // 4. Navigate to another page (e.g. /rooms) to confirm ongoing tracking continues for rejected cookies
  console.log("4. Navigating to /rooms to verify continued tracking for guests who clicked Reject...");
  await page.goto("http://localhost:5173/rooms", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);

  const hasRoomsPageview = collectRequests.some((r) => r.data && r.data.path === "/rooms");
  console.log(`✓ Has /rooms pageview beacon: ${hasRoomsPageview}`);
  if (!hasRoomsPageview) {
    throw new Error("/rooms pageview was NOT collected for visitor who clicked Reject!");
  }

  // 5. Open Admin Panel to verify telemetry in dashboard
  console.log("5. Checking Admin Visitors dashboard for updated metrics...");
  const loginRes = await fetch("http://localhost:8080/api/v1/admin/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "admin@oceanweligama.com", password: "OceanAdmin2025!" }),
  });
  const { token } = await loginRes.json();

  const adminPage = await context.newPage();
  await adminPage.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
  await adminPage.evaluate((tok) => {
    localStorage.setItem("ow-admin-token", tok);
  }, token);

  await adminPage.goto("http://localhost:5173/ow-admin/visitors", { waitUntil: "domcontentloaded" });
  await adminPage.waitForTimeout(2500);

  // Locate the Cookie Consents card in admin dashboard
  const cookieCardAdmin = adminPage.locator('div:has(div:has-text("Cookie Consents"))').first();
  await cookieCardAdmin.scrollIntoViewIfNeeded();
  const cardText = await cookieCardAdmin.innerText();
  console.log(`✓ Admin Cookie Consents card text:\n${cardText}`);

  // Take screenshot of Admin dashboard
  const screenshotPath = "/Users/pasindumalinda/.gemini/antigravity/brain/ea0d7e7e-a7c6-469e-bf7f-70132c43e397/admin_cookie_reject_tracking_verified.png";
  await adminPage.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`📸 Saved screenshot: ${screenshotPath}`);

  await browser.close();
  console.log("🎉 All Cookie Reject tracking tests passed 100%!");
}

run().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
