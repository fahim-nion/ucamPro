import express from 'express';
import { sessionManager } from '../core/session.js';
import { AttendanceScraper } from '../scrapers/attendance.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await sessionManager.usePage(async (page) => {
            return await new AttendanceScraper(page).scrape();
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;