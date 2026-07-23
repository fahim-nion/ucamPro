import { browserManager } from './browser.js';
import { performLogin } from '../services/login.js';

class SessionManager {
    constructor() {
        this.isAuthenticated = false;
        this.sharedPage = null;
        this.lock = Promise.resolve(); // This is our "Queue"
    }

    async login(user, pass) {
        // This ensures if login is called while another login is happening, they queue up
        return this.usePage(async (page) => {
            console.log("🚀 Starting authenticated session...");
            await performLogin(page, user, pass);
            this.isAuthenticated = true;
        });
    }

    /**
     * This is the "Magic" function. 
     * It ensures that even if 4 APIs are called at once, 
     * they run one after another in the same tab.
     */
    async usePage(task) {
        this.lock = this.lock.then(async () => {
            // Ensure sharedPage is active
            if (!this.sharedPage || this.sharedPage.isClosed()) {
                const context = await browserManager.getContext();
                this.sharedPage = await context.newPage();
            }
            
            try {
                return await task(this.sharedPage);
            } catch (error) {
                console.error("Scraper Queue Error:", error.message);
                throw error;
            }
        });
        return this.lock;
    }

    async getStatus() {
        return this.isAuthenticated;
    }
}

export const sessionManager = new SessionManager();