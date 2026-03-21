import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// Get all announcements
router.get('/', async (req, res) => {
    try {
        const [announcements] = await db.query('SELECT * FROM announcements ORDER BY created_at DESC');
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
});

// Create announcement (manager only)
router.post('/', authenticate, requireRole('manager'), async (req, res) => {
    try {
        const { title, content, priority } = req.body;
        const newAnnouncementId = uuidv4();

        await db.query(`
            INSERT INTO announcements (id, title, content, priority, created_by)
            VALUES (?, ?, ?, ?, ?)
        `, [newAnnouncementId, title, content, priority || 'normal', req.user.id]);

        const [newAnnouncement] = await db.query('SELECT * FROM announcements WHERE id = ?', [newAnnouncementId]);
        res.status(201).json(newAnnouncement[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create announcement' });
    }
});

// Update announcement
router.put('/:id', authenticate, requireRole('manager'), async (req, res) => {
    try {
        const { title, content, priority } = req.body;
        
        await db.query(`
            UPDATE announcements 
            SET title = ?, content = ?, priority = ?
            WHERE id = ?
        `, [title, content, priority, req.params.id]);

        const [updatedAnnouncement] = await db.query('SELECT * FROM announcements WHERE id = ?', [req.params.id]);
        res.json(updatedAnnouncement[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update announcement' });
    }
});

// Delete announcement
router.delete('/:id', authenticate, requireRole('manager'), async (req, res) => {
    try {
        await db.query('DELETE FROM announcements WHERE id = ?', [req.params.id]);
        res.json({ message: 'Announcement deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete announcement' });
    }
});

export default router;
