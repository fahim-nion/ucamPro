import dotenv from 'dotenv';
import path from 'path';

// This ensures it looks for the .env file in the root directory
dotenv.config();

export const SETTINGS = {
  USERNAME: process.env.SCRAPER_USERNAME,
  PASSWORD: process.env.SCRAPER_PASSWORD,
  LOGIN_URL: "https://ucam.buft.edu.bd/Security/LogIn.aspx",
  DEFAULT_SESSION_ID: process.env.DEFAULT_SESSION_ID || "29",
  SELECTORS: {
    dashboardIndicator: "Routine" 
  }
};

// Fail-safe: Stop the server if credentials aren't set
if (!SETTINGS.USERNAME || !SETTINGS.PASSWORD) {
  console.error("------------------------------------------------------------");
  console.error("❌ ERROR: SCRAPER_USERNAME or SCRAPER_PASSWORD is not set!");
  console.error("Please create a .env file in the root directory.");
  console.error("------------------------------------------------------------");
  process.exit(1); 
}