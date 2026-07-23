import { SETTINGS } from '../core/config.js';

/**
 * Performs the login sequence for the UCAM Portal.
 * Optimized for the horizontal menu layout and ASP.NET postbacks.
 */
export async function performLogin(page, username, password) {
    console.log(`\n🔑 Login sequence started for: ${username}`);
    
    try {
        // 1. Navigate to the Login Page
        await page.goto("https://ucam.buft.edu.bd/Security/LogIn.aspx", { 
            waitUntil: 'load', 
            timeout: 60000 
        });

        // 2. Locate the credentials fields using ARIA roles (matches your working Python logic)
        const userField = page.getByRole("textbox", { name: "Enter your Login Id/username" });
        const passField = page.getByRole("textbox", { name: "Enter your password" });
        const loginBtn = page.getByRole("button", { name: "LOG IN" });

        // Ensure fields are visible
        await userField.waitFor({ state: 'visible', timeout: 15000 });

        // 3. Fill Credentials
        console.log("⌨️ Filling credentials...");
        await userField.fill(username);
        await passField.fill(password);

        // 4. Click Login and wait for the dashboard transition
        console.log("🖱️ Clicking LOG IN button...");
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle', timeout: 60000 }).catch(() => {
                console.log("⚠️ Navigation wait timed out, checking page state manually...");
            }),
            loginBtn.click()
        ]);

        // 5. Handle potential Post-Login Redirects (Notice/Announcement pages)
        const currentUrl = page.url();
        console.log(`📍 Landed at: ${currentUrl}`);

        // If we are stuck on a notice page, force-navigate to the student home
        if (!currentUrl.toLowerCase().includes("home.aspx")) {
            console.log("⚠️ Not on the main dashboard. Attempting redirect to Student Home...");
            await page.goto("https://ucam.buft.edu.bd/Security/Login.aspx", { 
                waitUntil: 'networkidle', 
                timeout: 30000 
            }).catch(() => {});
        }

        // 6. Check for Login Failure messages
        const errorLabel = page.locator("#ctl00_MainContainer_lblErrorMessage");
        if (await errorLabel.isVisible()) {
            const msg = await errorLabel.innerText();
            console.error(`❌ Portal Rejected Login: ${msg}`);
            throw new Error(`UCAM Login Error: ${msg}`);
        }

        // 7. VERIFY SUCCESS
        // Based on your screenshot, we look for 'Logout' or your ID '242-004-501' in the top right.
        console.log("⏳ Verifying authentication state...");
        
        const successIndicators = [
            page.locator('text="Logout"'),
            page.locator(`text="${username}"`),
            page.locator('text="Attendance"'),
            page.locator('text="Routine"')
        ];

        // Wait for any of these to appear (indicates success)
        await Promise.any(
            successIndicators.map(locator => 
                locator.waitFor({ state: 'visible', timeout: 20000 })
            )
        );

        console.log("✅ Login Successful. Session established.");
        return page;

    } catch (error) {
        console.error("❌ Login process failed.");
        
        // Take a screenshot for debugging
        const debugPath = 'login_failure_debug.png';
        await page.screenshot({ path: debugPath, fullPage: true });
        console.log(`📸 Screenshot saved to ${debugPath}. Please check if a popup or notice is visible.`);
        
        throw new Error(`Portal Login Failed: ${error.message}`);
    }
}