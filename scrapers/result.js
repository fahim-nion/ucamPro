import { navigateToResult } from './navigation.js';
import { logger, takeErrorScreenshot } from './helpers.js';

export class ResultScraper {
    constructor(page) { this.page = page; }

    async scrape() {
        try {
            await navigateToResult(this.page);
            await this.page.waitForSelector("#ctl00_MainContainer_gvResult", { timeout: 20000 });

            const rows = this.page.locator("#ctl00_MainContainer_gvResult tbody tr");
            const count = await rows.count();
            const results = [];

            for (let i = 1; i < count; i++) {
                const cols = rows.nth(i).locator("td");
                results.push({
                    semester: (await cols.nth(1).innerText()).trim(),
                    credits: (await cols.nth(2).innerText()).trim(),
                    gpa: (await cols.nth(3).innerText()).trim(),
                    cgpa: (await cols.nth(4).innerText()).trim()
                });
            }

            const finalCgpa = (await this.page.locator("#ctl00_MainContainer_lblCGPA").innerText()).trim();
            
            console.log(`✅ Result scrape completed for ${results.length} semesters. CGPA: ${finalCgpa}`);
            return { results, final_cgpa: finalCgpa };
        } catch (e) {
            await takeErrorScreenshot(this.page, 'result_error');
            throw e;
        }
    }
}