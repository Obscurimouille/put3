import express from 'express';
import { SessionService } from '../../../services/sessions.service';
const router = express.Router();

router.get('/exists', (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(200).json({ success: false, message: 'Missing code' });

    const session = SessionService.find(code as string);
    if (session) return res.status(200).json({ success: true });

    // Delay to avoid brute force
    setTimeout(() => {
        return res.status(200).json({ success: false });
    }, 2000);
});

export default router;
