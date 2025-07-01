// Example automation scripts for Klynt app testing

// 1. Test single item order form submission
async function testSingleItemOrder(puppeteer) {
  // Navigate to the app
  await puppeteer.navigate({ url: 'http://localhost:5173' });
  
  // Click on "Start Your Order" button
  await puppeteer.click({ selector: '.btn-primary' });
  
  // Wait for form to load
  await puppeteer.waitFor({ selector: 'form', timeout: 5000 });
  
  // Fill in the form using placeholder selectors
  await puppeteer.fill({ selector: 'input[placeholder="John Doe"]', value: 'John Doe' });
  await puppeteer.fill({ selector: 'input[placeholder="john@example.com"]', value: 'john@example.com' });
  await puppeteer.fill({ selector: 'input[placeholder="868-123-4567"]', value: '868-555-0123' });
  await puppeteer.fill({ selector: 'input[placeholder="Port of Spain, Trinidad"]', value: '123 Test Street, Port of Spain' });
  await puppeteer.fill({ selector: 'input[placeholder="https://www.amazon.com/product..."]', value: 'https://www.amazon.com/test-product' });
  await puppeteer.fill({ selector: 'textarea[placeholder*="special instructions"]', value: 'Test order from automation' });
  
  // Take screenshot of filled form
  await puppeteer.screenshot({ fullPage: true });
  
  // Submit the form
  await puppeteer.click({ selector: 'button[type="submit"]' });
  
  // Wait for success message or redirect
  await puppeteer.waitFor({ selector: '.success-message', timeout: 10000 });
}

// 2. Test multi-item order form
async function testMultiItemOrder(puppeteer) {
  await puppeteer.navigate({ url: 'http://localhost:5173' });
  
  // Click on "Start Your Order" button and toggle to multi-item
  await puppeteer.click({ selector: '.btn-primary' });
  
  // Wait for form and toggle to multi-item mode
  await puppeteer.waitFor({ selector: 'form', timeout: 5000 });
  await puppeteer.click({ selector: '.relative.inline-flex.h-6.w-11' }); // Toggle switch
  
  // Fill customer details using placeholder selectors
  await puppeteer.fill({ selector: 'input[placeholder="John Doe"]', value: 'Jane Smith' });
  await puppeteer.fill({ selector: 'input[placeholder="john@example.com"]', value: 'jane@example.com' });
  await puppeteer.fill({ selector: 'input[placeholder="868-123-4567"]', value: '868-555-0456' });
  await puppeteer.fill({ selector: 'input[placeholder="Port of Spain, Trinidad"]', value: '456 Test Ave' });
  
  // Add first item (multi-item form will have different structure)
  await puppeteer.fill({ selector: 'input[placeholder*="amazon.com"]', value: 'https://www.shein.com/test-item-1' });
  
  // Add another item if "Add Item" button exists
  const addItemButton = await puppeteer.evaluate({ 
    script: 'document.querySelector("button:contains(\'Add Item\')")' 
  });
  if (addItemButton) {
    await puppeteer.click({ selector: 'button:contains("Add Item")' });
  }
  
  // Screenshot the form
  await puppeteer.screenshot({ selector: 'form', fullPage: false });
}

// 3. Test order tracking
async function testOrderTracking(puppeteer) {
  await puppeteer.navigate({ url: 'http://localhost:5173/tracking' });
  
  // Enter order ID
  await puppeteer.fill({ selector: 'input[name="orderId"]', value: 'KS-2025-0001' });
  
  // Click track button
  await puppeteer.click({ selector: 'button:has-text("Track Order")' });
  
  // Wait for results
  await puppeteer.waitFor({ selector: '.order-status', timeout: 5000 });
  
  // Get order status
  const status = await puppeteer.evaluate({ 
    script: 'document.querySelector(".order-status").textContent' 
  });
  
  console.log('Order status:', status);
}

// 4. Test responsive design
async function testMobileView(puppeteer) {
  // Set mobile viewport
  await puppeteer.evaluate({
    script: `(() => {
      const viewport = { width: 375, height: 667 };
      window.resizeTo(viewport.width, viewport.height);
      return viewport;
    })()`
  });
  
  await puppeteer.navigate({ url: 'http://localhost:5173' });
  
  // Take screenshots of mobile views
  await puppeteer.screenshot({ fullPage: true });
  
  // Test mobile navigation (hamburger menu)
  const hamburgerButton = await puppeteer.evaluate({
    script: 'document.querySelector("button[aria-label*=\'menu\']") || document.querySelector("button svg")'
  });
  if (hamburgerButton) {
    await puppeteer.click({ selector: 'button svg' }); // Hamburger icon
    await puppeteer.screenshot({ selector: '.mobile-menu' });
  }
}

// 5. Test form validation
async function testFormValidation(puppeteer) {
  await puppeteer.navigate({ url: 'http://localhost:5173' });
  
  // Try to submit empty form
  await puppeteer.click({ selector: '.btn-primary' });
  await puppeteer.waitFor({ selector: 'form', timeout: 5000 });
  await puppeteer.click({ selector: 'button[type="submit"]' });
  
  // Check for validation errors
  const errors = await puppeteer.evaluate({
    script: `Array.from(document.querySelectorAll('.error-message')).map(el => el.textContent)`
  });
  
  console.log('Validation errors:', errors);
  
  // Test invalid email
  await puppeteer.fill({ selector: 'input[placeholder="john@example.com"]', value: 'invalid-email' });
  await puppeteer.click({ selector: 'button[type="submit"]' });
  
  // Screenshot validation state
  await puppeteer.screenshot({ selector: 'form' });
}

// 6. Performance monitoring
async function testPerformance(puppeteer) {
  // Navigate and measure load time
  const startTime = Date.now();
  await puppeteer.navigate({ url: 'http://localhost:5173' });
  const loadTime = Date.now() - startTime;
  
  // Get performance metrics
  const metrics = await puppeteer.evaluate({
    script: `(() => {
      const perf = window.performance;
      return {
        loadTime: perf.timing.loadEventEnd - perf.timing.navigationStart,
        domReady: perf.timing.domContentLoadedEventEnd - perf.timing.navigationStart,
        resources: perf.getEntriesByType('resource').length
      };
    })()`
  });
  
  console.log('Performance metrics:', metrics);
  console.log('Total load time:', loadTime, 'ms');
}

// Export examples
export {
  testSingleItemOrder,
  testMultiItemOrder,
  testOrderTracking,
  testMobileView,
  testFormValidation,
  testPerformance
};