import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// Submit baptism/kwakirwa registration (member)
router.post('/', authenticate, async (req, res) => {
    try {
        const { full_name, national_id, family_details, registration_type } = req.body;
        // registration_type: 'baptism' or 'kwakirwa'
        const newRegistrationId = uuidv4();

        await db.query(`
            INSERT INTO baptism_registrations (id, user_id, full_name, national_id, family_details, registration_type, status)
            VALUES (?, ?, ?, ?, ?, ?, 'pending')
        `, [newRegistrationId, req.user.id, full_name, national_id, family_details, registration_type]);

        const [newRegistration] = await db.query('SELECT * FROM baptism_registrations WHERE id = ?', [newRegistrationId]);
        res.status(201).json(newRegistration[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit registration' });
    }
});

// Get all registrations (pastor only)
router.get('/', authenticate, requireRole('pastor'), async (req, res) => {
    try {
        const [registrations] = await db.query(`
            SELECT br.*, u.full_name as user_name, u.email as user_email
            FROM baptism_registrations br
            LEFT JOIN users u ON br.user_id = u.id
            ORDER BY br.created_at DESC
        `);

        // Format to match old Supabase response structure where possible
        const formattedRegistrations = registrations.map(reg => ({
            ...reg,
            profiles: { full_name: reg.user_name, email: reg.user_email }
        }));

        res.json(formattedRegistrations);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch registrations' });
    }
});

// Update registration status (pastor)
router.put('/:id', authenticate, requireRole('pastor'), async (req, res) => {
    try {
        const { status, pastor_note, ceremony_date } = req.body;
        
        await db.query(
            'UPDATE baptism_registrations SET status = ?, pastor_note = ?, ceremony_date = ? WHERE id = ?',
            [status, pastor_note, ceremony_date, req.params.id]
        );

        const [updatedRegistration] = await db.query('SELECT * FROM baptism_registrations WHERE id = ?', [req.params.id]);
        res.json(updatedRegistration[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update registration' });
    }
});

export default router;
