import { navigateToAttendance } from './navigation.js';
import { logger, safeSelect, takeErrorScreenshot } from './helpers.js';
import { SETTINGS } from '../core/config.js';

export class AttendanceScraper {
    constructor(page) { this.page = page; }

    async scrape() {
        try {
            await navigateToAttendance(this.page);
            await safeSelect(this.page, "#ctl00_MainContainer_ddlSession", SETTINGS.DEFAULT_SESSION_ID || "29", 'Session');
            
            await this.page.getByRole('button', { name: 'Load' }).click();
            await this.page.waitForSelector("#ctl00_MainContainer_gvCourseList", { timeout: 15000 });

            const rows = this.page.locator("#ctl00_MainContainer_gvCourseList tbody tr");
            const count = await rows.count();
            const courses = [];

            for (let i = 1; i < count; i++) {
                const cells = rows.nth(i).locator("td");
                const courseText = (await cells.nth(1).innerText()).split("\n");
                const attText = (await cells.nth(4).innerText()).split("\n");

                courses.push({
                    course_code: courseText[0]?.split(": ")[1]?.trim() || "N/A",
                    title: courseText[1]?.split(": ")[1]?.trim() || "N/A",
                    total_class: attText[0]?.split(": ")[1]?.trim() || "0",
                    present_percentage: attText[3]?.split(": ")[1]?.trim() || "0%"
                });
            }

            // ADDED LOG HERE
            console.log(`✅ Attendance scrape completed for ${courses.length} courses`);
            return courses;
        } catch (e) {
            await takeErrorScreenshot(this.page, 'attendance_error');
            throw e;
        }
    }
}