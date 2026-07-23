import express from 'express';
import { sessionManager } from '../core/session.js';
import { ResultScraper } from '../scrapers/result.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await sessionManager.usePage(async (page) => {
            return await new ResultScraper(page).scrape();
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;