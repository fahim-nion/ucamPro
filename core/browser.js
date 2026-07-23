import { chromium } from 'playwright';

class BrowserManager {
  constructor() {
    this.browser = null;
    this.context = null;
  }

  async getContext() {
    if (!this.browser) {
      this.browser = await chromium.launch({ headless: false,slowMo:100 });
      this.context = await this.browser.newContext();
    }
    return this.context;
  }

  async close() {
    if (this.browser) await this.browser.close();
  }
}

export const browserManager = new BrowserManager();