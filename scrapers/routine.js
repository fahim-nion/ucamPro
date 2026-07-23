import { navigateToRoutine } from './navigation.js';
import { logger, safeSelect, takeErrorScreenshot } from './helpers.js';
import { SETTINGS } from '../core/config.js';

export class RoutineScraper {
    constructor(page) { this.page = page; }

    async scrape() {
        try {
            await navigateToRoutine(this.page);

            await safeSelect(this.page, "#ctl00_MainContainer_ucSession_ddlSession", SETTINGS.DEFAULT_SESSION_ID || "29", 'Session');
            
            const viewBtn = this.page.getByRole('button', { name: 'View Routine' });
            await viewBtn.click();
            await this.page.waitForLoadState("networkidle");
            await viewBtn.click().catch(() => {}); 
            await viewBtn.click().catch(() => {}); 
            
            logger.step('Waiting for Routine table...');
            await this.page.waitForTimeout(4000); 

            const targetTable = this.page.locator('table').nth(24);
            const rows = targetTable.locator('tr');
            const count = await rows.count();
            
            const routine = [];
            const validDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

            for (let i = 0; i < count; i++) {
                const cols = rows.nth(i).locator("td");
                const colCount = await cols.count();
                
                // Valid routine rows have at least 7 columns
                if (colCount >= 7) {
                    const cCode = (await cols.nth(0).innerText()).trim();
                    const cTitle = (await cols.nth(1).innerText()).trim();
                    const teacher = (await cols.nth(2).innerText()).trim();
                    const day = (await cols.nth(4).innerText()).trim();
                    const room = (await cols.nth(5).innerText()).trim();
                    const timeSlot = (await cols.nth(6).innerText()).trim();

                    // Filter out header rows and student metadata
                    if (cCode !== "Course" && cTitle !== "Course Title" && validDays.some(d => day.includes(d))) {
                        routine.push({
                            course_code: cCode,
                            course_title: cTitle,
                            teacher: teacher,
                            day: day,
                            room: room,
                            time_slot: timeSlot
                        });
                    }
                }
            }

            console.log(`✅ Routine scrape completed with ${routine.length} structured classes.`);
            return routine;
        } catch (e) {
            await takeErrorScreenshot(this.page, 'routine_error');
            throw e;
        }
    }
}