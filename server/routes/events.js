import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// Get all events (public)
router.get('/', async (req, res) => {
    try {
        const [events] = await db.query('SELECT * FROM events ORDER BY event_date ASC');
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Create event (manager only)
router.post('/', authenticate, requireRole('manager'), async (req, res) => {
    try {
        const { title, description, event_date, location, image_url } = req.body;
        const newEventId = uuidv4();

        await db.query(`
            INSERT INTO events (id, title, description, event_date, location, image_url, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [newEventId, title, description, event_date, location, image_url, req.user.id]);

        const [newEvent] = await db.query('SELECT * FROM events WHERE id = ?', [newEventId]);
        res.status(201).json(newEvent[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// Update event (manager only)
router.put('/:id', authenticate, requireRole('manager'), async (req, res) => {
    try {
        const { title, description, event_date, location, image_url } = req.body;
        
        await db.query(`
            UPDATE events 
            SET title = ?, description = ?, event_date = ?, location = ?, image_url = ?
            WHERE id = ?
        `, [title, description, event_date, location, image_url, req.params.id]);

        const [updatedEvent] = await db.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
        res.json(updatedEvent[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update event' });
    }
});

// Delete event (manager only)
router.delete('/:id', authenticate, requireRole('manager'), async (req, res) => {
    try {
        await db.query('DELETE FROM events WHERE id = ?', [req.params.id]);
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

export default router;
