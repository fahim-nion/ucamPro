import { navigateToRoutine } from './navigation.js';
import { logger, takeErrorScreenshot } from './helpers.js';

export class RoutineScraper {
    constructor(page) {
        this.page = page;
    }

    async scrape() {
        try {
            await navigateToRoutine(this.page);

            // Select Session
            await this.page
                .locator("#ctl00_MainContainer_ucSession_ddlSession")
                .selectOption("29");

            // Generate Routine
            const viewBtn = this.page.getByRole("button", {
                name: "View Routine"
            });

            await viewBtn.click();
            await this.page.waitForLoadState("networkidle");
            await viewBtn.click().catch(() => {});
            await viewBtn.click().catch(() => {});

            logger.step("Generating report table...");
            await this.page.waitForTimeout(5000);

            // ----------------------------------------------------
            // Automatically locate the routine table
            // ----------------------------------------------------

            const tables = this.page.locator("table");
            const tableCount = await tables.count();

            let targetTable = null;

            for (let i = 0; i < tableCount; i++) {
                const table = tables.nth(i);

                const text = await table.innerText().catch(() => "");

                if (
                    text.includes("Course Title") &&
                    text.includes("Teacher") &&
                    text.includes("Time Slot") &&
                    text.includes("Routine Course")
                ) {
                    targetTable = table;
                    console.log(`✅ Routine table found at index ${i}`);
                    break;
                }
            }

            if (!targetTable) {
                throw new Error("Routine table not found.");
            }

            const rows = targetTable.locator("tr");
            const rowCount = await rows.count();

            console.log(`📊 Routine rows: ${rowCount}`);

            const DAY_MAP = {
                Sun: "Sunday",
                Mon: "Monday",
                Tue: "Tuesday",
                Wed: "Wednesday",
                Thu: "Thursday",
                Fri: "Friday",
                Sat: "Saturday"
            };

            const routine = {
                Sunday: [],
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: [],
                Saturday: []
            };

            // Previous full row (needed because ASP.NET merges cells)
            let lastCourse = null;

            for (let i = 2; i < rowCount; i++) {

                const cols = rows.nth(i).locator("td");
                const colCount = await cols.count();

                if (colCount !== 11 && colCount !== 9)
                    continue;

                let course;

                // ------------------------------------------------
                // Full row (first occurrence of a course)
                // ------------------------------------------------
                if (colCount === 11) {

                    let teacher = (await cols.nth(3).innerText()).trim();

                    if (teacher.includes("_")) {
                        teacher = teacher.split("_", 2)[1];
                    }

                    course = {
                        code: (await cols.nth(1).innerText()).trim(),
                        course: (await cols.nth(2).innerText()).trim(),
                        faculty: teacher,
                        room: (await cols.nth(6).innerText()).trim(),
                        time: (await cols.nth(7).innerText()).trim(),
                        day: (await cols.nth(5).innerText()).trim()
                    };

                    lastCourse = {
                        code: course.code,
                        course: course.course,
                        faculty: course.faculty
                    };
                }

                // ------------------------------------------------
                // Continuation row (merged course/code cells)
                // ------------------------------------------------
                else {

                    if (!lastCourse)
                        continue;

                    let teacher = (await cols.nth(1).innerText()).trim();

                    if (teacher.includes("_")) {
                        teacher = teacher.split("_", 2)[1];
                    }

                    course = {
                        code: lastCourse.code,
                        course: lastCourse.course,
                        faculty: teacher,
                        room: (await cols.nth(4).innerText()).trim(),
                        time: (await cols.nth(5).innerText()).trim(),
                        day: (await cols.nth(3).innerText()).trim()
                    };
                }

                const dayName = DAY_MAP[course.day];

                if (!dayName)
                    continue;

                routine[dayName].push({
                    code: course.code,
                    course: course.course,
                    faculty: course.faculty,
                    room: course.room,
                    time: course.time
                });
            }

            // ----------------------------------------------------
            // Sort classes by start time
            // ----------------------------------------------------

            function parseTime(slot) {
                const start = slot.split("-")[0].trim();

                let [time, ampm] = start.split(" ");
                let [hour, minute] = time.split(":").map(Number);

                if (ampm === "PM" && hour !== 12)
                    hour += 12;

                if (ampm === "AM" && hour === 12)
                    hour = 0;

                return hour * 60 + minute;
            }

            Object.values(routine).forEach(day => {
                day.sort((a, b) => parseTime(a.time) - parseTime(b.time));
            });

            console.log(JSON.stringify(routine, null, 2));

            return routine;

        } catch (e) {
            await takeErrorScreenshot(this.page, "routine_error");
            throw e;
        }
    }
}