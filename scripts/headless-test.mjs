import { chromium } from 'playwright';

const url = process.env.TEST_URL || 'http://127.0.0.1:5005/';
const screenshotPath = process.env.SCREENSHOT_PATH || 'headless-screenshot.png';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });

  const pageErrors = [];
  page.on('pageerror', err => {
    pageErrors.push({ message: err.message, stack: err.stack });
  });

  const responses = [];
  page.on('response', r => {
    try {
      responses.push({ url: r.url(), status: r.status(), ok: r.ok() });
    } catch (e) {
      // ignore
    }
  });

  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const status = resp ? resp.status() : null;
    // give client JS a moment to run
    await page.waitForTimeout(2000);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    console.log('HEADLESS_TEST_RESULT:');
    console.log('PAGE_STATUS:', status);
    console.log('CONSOLE_MESSAGES:', JSON.stringify(consoleMessages, null, 2));
    console.log('PAGE_ERRORS:', JSON.stringify(pageErrors, null, 2));
    // filter to root and assets to keep output focused
    const filtered = responses.filter(r => r.url === url || r.url.includes('/assets/') || r.url.endsWith('.js') || r.url.endsWith('.css'));
    console.log('RESPONSES:', JSON.stringify(filtered, null, 2));
    console.log('SCREENSHOT:', screenshotPath);
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('HEADLESS_TEST_ERROR:', err);
    await browser.close();
    process.exit(2);
  }
})();
