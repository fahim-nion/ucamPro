import { chromium } from 'playwright';

class BrowserManager {
  constructor() {
    this.browser = null;
    this.context = null;
  }

  async getContext() {
    if (!this.browser) {
      console.log("🚀 Launching Chromium...");
      this.browser = await chromium.launch({ 
        headless: true, 
        slowMo: 150, 
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox', 
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      });
      
      this.context = await this.browser.newContext({
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      });
    }
    return this.context;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
    }
  }
}

export const browserManager = new BrowserManager();