import { logger } from './helpers.js';

// --- LOCKED: PROFILE, ATTENDANCE, RESULT (Working) ---
export async function navigateToProfile(page) {
    logger.header('Profile', page);
    await page.goto("https://ucam.buft.edu.bd/Security/Home.aspx", { waitUntil: 'load' });
    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('link', { name: 'User' }).click();
    await page.getByRole('link', { name: 'Student Profile' }).click();
}
export async function navigateToAttendance(page) {
    logger.header('Attendance', page);
    await page.goto("https://ucam.buft.edu.bd/Security/Home.aspx", { waitUntil: 'load' });
    await page.getByRole('link', { name: 'Attendance', exact: true }).click();
    await page.getByRole('link', { name: 'Attendance Dashboard' }).click();
}
export async function navigateToResult(page) {
    logger.header('Result', page);
    await page.goto("https://ucam.buft.edu.bd/Security/Home.aspx", { waitUntil: 'load' });
    await page.getByRole('link', { name: 'Result' }).click();
    await page.getByRole('link', { name: 'History', exact: true }).click();
}

// --- FIXED: ROUTINE NAVIGATION WITH COMPLETION GUARD ---
export async function navigateToRoutine(page) {
    logger.header('Routine', page);
    await page.goto("https://ucam.buft.edu.bd/Security/Home.aspx", { waitUntil: 'load' });

    // 1. Click Routine
    await page.getByRole('link', { name: 'Routine', exact: true }).click();
    
    // 2. Click Report (Filtered by visibility to solve Strict Mode error)
    await page.getByRole('link', { name: 'Report' }).filter({ visible: true }).first().click();
    
    // 3. Click Student Class Routine
    await page.getByRole('link', { name: 'Student Class Routine' }).click();

    // 🚀 THE FIX: Do not leave this function until the Routine dropdown is visible
    await page.waitForSelector("#ctl00_MainContainer_ucSession_ddlSession", { timeout: 30000 });
    console.log("🏁 Reached Routine Page Successfully");
}