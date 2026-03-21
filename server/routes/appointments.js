import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// Book appointment (member)
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, description, preferred_date, preferred_time } = req.body;
        const newAppointmentId = uuidv4();

        await db.query(`
            INSERT INTO appointments (id, user_id, title, description, preferred_date, preferred_time, status)
            VALUES (?, ?, ?, ?, ?, ?, 'pending')
        `, [newAppointmentId, req.user.id, title, description, preferred_date, preferred_time]);

        const [newAppointment] = await db.query('SELECT * FROM appointments WHERE id = ?', [newAppointmentId]);
        res.status(201).json(newAppointment[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to book appointment' });
    }
});

// Get all appointments (pastor only)
router.get('/', authenticate, requireRole('pastor'), async (req, res) => {
    try {
        const [appointments] = await db.query(`
            SELECT a.*, u.full_name as user_name, u.email as user_email, u.phone as user_phone
            FROM appointments a
            LEFT JOIN users u ON a.user_id = u.id
            ORDER BY a.preferred_date ASC
        `);

        const formattedAppointments = appointments.map(appt => ({
            ...appt,
            profiles: { full_name: appt.user_name, email: appt.user_email, phone: appt.user_phone }
        }));

        res.json(formattedAppointments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Get my appointments (member)
router.get('/mine', authenticate, async (req, res) => {
    try {
        const [appointments] = await db.query(
            'SELECT * FROM appointments WHERE user_id = ? ORDER BY preferred_date ASC',
            [req.user.id]
        );
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Update appointment status (pastor)
router.put('/:id', authenticate, requireRole('pastor'), async (req, res) => {
    try {
        const { status, pastor_note } = req.body;
        
        await db.query(
            'UPDATE appointments SET status = ?, pastor_note = ? WHERE id = ?',
            [status, pastor_note, req.params.id]
        );

        const [updatedAppointment] = await db.query('SELECT * FROM appointments WHERE id = ?', [req.params.id]);
        res.json(updatedAppointment[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update appointment' });
    }
});

export default router;
