const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log(msg.text()));

  try {
    console.log('Navigating to http://localhost:5183/');
    await page.goto('http://localhost:5183/', { waitUntil: 'networkidle' });
    console.log('Page loaded. Taking screenshot of initial state.');
    await page.screenshot({ path: 'final_screenshot_initial.png' });

    console.log('Waiting for main layout...');
    await page.waitForSelector('header');
    await page.waitForSelector('main');
    await page.waitForSelector('footer');

    console.log('Main layout is visible. Verification successful!');
  } catch (error) {
    console.error('An error occurred during verification:', error);
    await page.screenshot({ path: 'final_screenshot_error.png' });
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
