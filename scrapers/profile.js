import { navigateToProfile } from './navigation.js';
import { logger, takeErrorScreenshot } from './helpers.js';

export class ProfileScraper {
    constructor(page) { this.page = page; }

    async scrape() {
        try {
            await navigateToProfile(this.page);
            logger.step('Parsing profile fields...');
            
            const data = {
                name: await this.page.locator("#ctl00_MainContainer_txtFullName").inputValue(),
                email: await this.page.locator("#ctl00_MainContainer_txtEmail").inputValue(),
                phone: await this.page.locator("#ctl00_MainContainer_txtPhone").inputValue(),
                dob: await this.page.locator("#ctl00_MainContainer_txtDOB").inputValue(),
                religion: await this.page.locator("#ctl00_MainContainer_ddlReligion option:checked").innerText()
            };

            // ADDED LOG HERE
            console.log(`✅ Profile scrape completed for: ${data.name}`);
            return data;
        } catch (e) {
            await takeErrorScreenshot(this.page, 'profile_error');
            throw e;
        }
    }
}