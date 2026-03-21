import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// Submit prayer request (member)
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, description, is_anonymous } = req.body;
        const newRequestId = uuidv4();

        await db.query(`
            INSERT INTO prayer_requests (id, user_id, title, description, is_anonymous, status)
            VALUES (?, ?, ?, ?, ?, 'pending')
        `, [newRequestId, req.user.id, title, description, is_anonymous || false]);

        const [newRequest] = await db.query('SELECT * FROM prayer_requests WHERE id = ?', [newRequestId]);
        res.status(201).json(newRequest[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit prayer request' });
    }
});

// Get all prayer requests (pastor only)
router.get('/', authenticate, requireRole('pastor'), async (req, res) => {
    try {
        const [requests] = await db.query(`
            SELECT pr.*, u.full_name as user_name, u.email as user_email
            FROM prayer_requests pr
            LEFT JOIN users u ON pr.user_id = u.id
            ORDER BY pr.created_at DESC
        `);

        const formattedRequests = requests.map(req => ({
            ...req,
            profiles: { full_name: req.user_name, email: req.user_email }
        }));

        res.json(formattedRequests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch prayer requests' });
    }
});

// Get my prayer requests (member)
router.get('/mine', authenticate, async (req, res) => {
    try {
        const [requests] = await db.query(
            'SELECT * FROM prayer_requests WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch prayer requests' });
    }
});

// Update prayer request status (pastor)
router.put('/:id', authenticate, requireRole('pastor'), async (req, res) => {
    try {
        const { status, pastor_note } = req.body;
        
        await db.query(
            'UPDATE prayer_requests SET status = ?, pastor_note = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, pastor_note, req.params.id]
        );

        const [updatedRequest] = await db.query('SELECT * FROM prayer_requests WHERE id = ?', [req.params.id]);
        res.json(updatedRequest[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update prayer request' });
    }
});

export default router;
