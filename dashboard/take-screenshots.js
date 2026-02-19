#!/usr/bin/env node

import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');
const BASE_URL = 'http://localhost:5173/decisify/';

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function takeScreenshot(page, name, fullPage = true) {
  const outputPath = path.join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({
    path: outputPath,
    fullPage: fullPage,
  });
  console.log(`✅ Screenshot saved: ${name}.png`);
}

async function main() {
  console.log('🚀 Starting screenshot capture...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Screenshot 1: Dashboard Overview
    console.log('📸 Capturing dashboard overview...');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for animations and data loading
    await takeScreenshot(page, 'dashboard-overview', true);

    // Screenshot 2: Signal Detail (try to click on a signal card)
    console.log('📸 Capturing signal detail...');
    try {
      // Wait for signal cards to load
      await page.waitForSelector('[class*="signal"]', { timeout: 5000 });
      
      // Try to find and click a signal card
      const signalCards = await page.$$('[class*="signal"]');
      if (signalCards.length > 0) {
        await signalCards[0].click();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (e) {
      console.log('⚠️  Could not interact with signal cards, taking current view');
    }
    await takeScreenshot(page, 'signal-detail', false);

    // Screenshot 3: Decision Flow (scroll down or navigate)
    console.log('📸 Capturing decision flow...');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Scroll down to show more content
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await takeScreenshot(page, 'decision-flow', false);

    console.log('✅ All screenshots captured successfully!');
  } catch (error) {
    console.error('❌ Error capturing screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
