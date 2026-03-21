import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// Submit marriage registration (member)
router.post('/', authenticate, async (req, res) => {
    try {
        const { spouse1_name, spouse1_id, spouse2_name, spouse2_id, marriage_date, recommendation_url } = req.body;
        const newMarriageId = uuidv4();

        await db.query(`
            INSERT INTO marriage_registrations (id, user_id, spouse1_name, spouse1_id, spouse2_name, spouse2_id, marriage_date, recommendation_url, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        `, [newMarriageId, req.user.id, spouse1_name, spouse1_id, spouse2_name, spouse2_id, marriage_date, recommendation_url]);

        const [newMarriage] = await db.query('SELECT * FROM marriage_registrations WHERE id = ?', [newMarriageId]);
        res.status(201).json(newMarriage[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit marriage registration' });
    }
});

// Get all marriage registrations (pastor only)
router.get('/', authenticate, requireRole('pastor'), async (req, res) => {
    try {
        const [registrations] = await db.query(`
            SELECT mr.*, u.full_name as user_name, u.email as user_email
            FROM marriage_registrations mr
            LEFT JOIN users u ON mr.user_id = u.id
            ORDER BY mr.created_at DESC
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

// Update marriage registration (pastor)
router.put('/:id', authenticate, requireRole('pastor'), async (req, res) => {
    try {
        const { status, pastor_note } = req.body;
        let familyIdToSet = null;

        // If approved, auto-create a new family
        if (status === 'approved') {
            const [registrations] = await db.query('SELECT * FROM marriage_registrations WHERE id = ?', [req.params.id]);
            
            if (registrations.length > 0) {
                const marriage = registrations[0];
                const newFamilyId = uuidv4();
                
                await db.query(`
                    INSERT INTO families (id, name, description)
                    VALUES (?, ?, ?)
                `, [newFamilyId, `${marriage.spouse1_name} & ${marriage.spouse2_name} Family`, `Married on ${marriage.marriage_date}`]);
                
                familyIdToSet = newFamilyId;
            }
        }

        // Update registration record
        if (familyIdToSet) {
            await db.query(
                'UPDATE marriage_registrations SET status = ?, pastor_note = ?, family_id = ? WHERE id = ?',
                [status, pastor_note, familyIdToSet, req.params.id]
            );
        } else {
            await db.query(
                'UPDATE marriage_registrations SET status = ?, pastor_note = ? WHERE id = ?',
                [status, pastor_note, req.params.id]
            );
        }

        const [updatedRegistration] = await db.query('SELECT * FROM marriage_registrations WHERE id = ?', [req.params.id]);
        res.json(updatedRegistration[0]);
    } catch (err) {
        console.error('Update marriage error:', err);
        res.status(500).json({ error: 'Failed to update registration' });
    }
});

export default router;
