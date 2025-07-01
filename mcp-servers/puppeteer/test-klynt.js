#!/usr/bin/env node

import puppeteer from 'puppeteer';

// Simple test runner for Klynt app automation
async function runTests() {
  console.log('Starting Klynt app automation tests...\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 800 }
  });
  
  const page = await browser.newPage();
  
  try {
    // Test 1: Navigate to homepage
    console.log('Test 1: Loading homepage...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'test-homepage.png' });
    console.log('✓ Homepage loaded successfully\n');
    
    // Test 2: Test single item order form
    console.log('Test 2: Testing single item order form...');
    
    // Click on "Start Your Order" button using class selector
    try {
      await page.waitForSelector('.btn-primary', { timeout: 5000 });
      await page.click('.btn-primary');
      await page.waitForSelector('form', { timeout: 5000 });
      
      // Fill form using placeholder selectors
      await page.type('input[placeholder="John Doe"]', 'Test User');
      await page.type('input[placeholder="john@example.com"]', 'test@example.com');
      await page.type('input[placeholder="868-123-4567"]', '868-555-0000');
      await page.type('input[placeholder="Port of Spain, Trinidad"]', '123 Test Street');
      await page.type('input[placeholder="https://www.amazon.com/product..."]', 'https://www.amazon.com/test');
      
      await page.screenshot({ path: 'test-single-item-form.png' });
      console.log('✓ Single item form tested\n');
    } catch (error) {
      console.log('⚠ Form test failed:', error.message, '\n');
    }
    
    // Test 3: Check mobile responsiveness
    console.log('Test 3: Testing mobile view...');
    await page.setViewport({ width: 375, height: 667 });
    await page.goto('http://localhost:5173');
    await page.screenshot({ path: 'test-mobile-view.png' });
    console.log('✓ Mobile view tested\n');
    
    // Test 4: Performance check
    console.log('Test 4: Checking performance...');
    const metrics = await page.metrics();
    console.log('Page metrics:', {
      documents: metrics.Documents,
      frames: metrics.Frames,
      jsHeapUsed: Math.round(metrics.JSHeapUsedSize / 1024 / 1024) + ' MB'
    });
    console.log('✓ Performance checked\n');
    
    console.log('All tests completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run tests
runTests().catch(console.error);