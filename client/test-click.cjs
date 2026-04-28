const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Set local storage for demo token
  await page.goto('http://localhost:5175/');
  await page.evaluate(() => {
    localStorage.setItem("test_token", "test-token");
  });
  
  // Navigate to dashboard
  await page.goto('http://localhost:5175/dashboard', { waitUntil: 'networkidle0' });
  
  // Upload a dummy file
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    // Create a dummy file and upload it
    const fs = require('fs');
    fs.writeFileSync('dummy.txt', 'This is a test resume.');
    await fileInput.uploadFile('dummy.txt');
    console.log("Uploaded file. Waiting for progress to complete...");
    
    // Wait for the button to be enabled (i.e. disabled property goes away)
    await page.waitForFunction(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Analyze Resume'));
      return btn && !btn.disabled;
    }, { timeout: 10000 });
    console.log("Button is now enabled.");
    
    // Get the button's position and try to find what element is on top of it
    const blockingElement = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Analyze Resume'));
      if (!btn) return "Button not found";
      
      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      const el = document.elementFromPoint(x, y);
      
      return {
        buttonClass: btn.className,
        topElementTagName: el ? el.tagName : null,
        topElementClass: el ? el.className : null,
        topElementId: el ? el.id : null,
        isButton: el === btn || btn.contains(el),
        x, y
      };
    });
    
    console.log("Element blocking check:", blockingElement);
    
    // Cleanup
    fs.unlinkSync('dummy.txt');
  } else {
    console.log("Could not find file input");
  }
  
  await browser.close();
})();
