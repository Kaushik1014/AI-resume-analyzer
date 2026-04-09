import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => console.log('BROWSER REQUEST FAILED:', request.url(), request.failure()?.errorText));

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 15000 });
    // Wait an extra 3 seconds for Spline to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.screenshot({ path: 'test_screenshot.png' });
    console.log('SUCCESS: Page loaded and screenshot saved to test_screenshot.png');
  } catch (err) {
    console.error('PUPPETEER ERROR:', err.message);
  } finally {
    await browser.close();
  }
})();
