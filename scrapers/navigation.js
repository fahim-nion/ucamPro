import { logger } from './helpers.js';

// KEEPING THESE EXACTLY AS THEY ARE SINCE THEY WORK
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

// ONLY CHANGING THIS ONE
export async function navigateToRoutine(page) {
    logger.header('Routine', page);
    await page.goto("https://ucam.buft.edu.bd/Security/Home.aspx", { waitUntil: 'load' });

    // 1. Click Routine
    await page.getByRole('link', { name: 'Routine', exact: true }).click();
    
    // 2. Click Report (Filter by VISIBLE to avoid the Admin -> Report conflict)
    // This is the clean fix for the "Strict Mode Violation"
    await page.getByRole('link', { name: 'Report' }).filter({ visible: true }).first().click();
    
    // 3. Click Student Class Routine
    await page.getByRole('link', { name: 'Student Class Routine' }).click();
}