const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

class CustomWorld extends World {
  constructor(options) {
    super(options);
  }

  async setup() {
    this.browser = await chromium.launch({
      headless: process.env.CI ? true : false,
      slowMo: 50
    });
    
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      baseURL: process.env.BASE_URL || 'http://localhost:3000'
    });
    
    this.page = await this.context.newPage();
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Hooks para setup e teardown
setWorldConstructor(CustomWorld);

module.exports = { CustomWorld }; 