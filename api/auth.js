import express from 'express';
import { sessionManager } from '../core/session.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password required" });
        }

        // sessionManager.login handles its own page lifecycle
        await sessionManager.login(username, password);
        res.json({ success: true });
    } catch (error) {
        console.error("❌ Auth Error:", error.message);
        res.status(401).json({ error: error.message });
    }
});

export default router;