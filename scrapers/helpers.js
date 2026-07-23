import path from 'path';
import fs from 'fs';

const errorDir = path.join(process.cwd(), 'errors');
if (!fs.existsSync(errorDir)) fs.mkdirSync(errorDir);

export const logger = {
    header: (name, page) => console.log(`\n========== ${name.toUpperCase()} ==========\nURL: ${page.url()}`),
    step: (msg) => console.log(`[Step] ${msg}`),
};

export async function takeErrorScreenshot(page, scraperName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(errorDir, `${scraperName}_${timestamp}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    console.error(`📸 Error screenshot saved: ${filePath}`);
}

export async function safeSelect(page, selector, value, name) {
    const dropdown = page.locator(selector);
    await dropdown.waitFor({ state: 'visible', timeout: 15000 });
    await dropdown.selectOption(value);
    console.log(`✅ Selected ${name}: ${value}`);
}