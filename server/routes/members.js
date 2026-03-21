import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// Get all members
router.get('/', authenticate, requireRole(['pastor', 'manager']), async (req, res) => {
    try {
        const [members] = await db.query(`
            SELECT m.*, u.email, u.role, u.avatar_url 
            FROM members m 
            LEFT JOIN users u ON m.user_id = u.id 
            ORDER BY m.created_at DESC
        `);
        res.json(members);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch members' });
    }
});

// Get single member
router.get('/:id', authenticate, async (req, res) => {
    try {
        const [members] = await db.query(`
            SELECT m.*, u.email, u.role, u.avatar_url 
            FROM members m 
            LEFT JOIN users u ON m.user_id = u.id 
            WHERE m.id = ?
        `, [req.params.id]);

        if (members.length === 0) return res.status(404).json({ error: 'Member not found' });
        res.json(members[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch member' });
    }
});

// Add new member (join church)
router.post('/', authenticate, async (req, res) => {
    try {
        const { full_name, national_id, education_level, phone, home_location, hobbies, user_id: provided_user_id } = req.body;
        
        // Only managers/pastors can specify a different user_id or create a member without one
        const isAdmin = ['manager', 'pastor'].includes(req.user.role);
        const final_user_id = isAdmin ? provided_user_id : req.user.id;

        const newMemberId = uuidv4();
        await db.query(`
            INSERT INTO members (id, user_id, full_name, national_id, education_level, phone, home_location, hobbies)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [newMemberId, final_user_id || null, full_name, national_id, education_level, phone, home_location, hobbies]);

        const [newMember] = await db.query('SELECT * FROM members WHERE id = ?', [newMemberId]);
        res.status(201).json(newMember[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add member' });
    }
});

// Update member
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { full_name, national_id, education_level, phone, home_location, hobbies } = req.body;
        
        await db.query(`
            UPDATE members 
            SET full_name = ?, national_id = ?, education_level = ?, phone = ?, home_location = ?, hobbies = ?
            WHERE id = ?
        `, [full_name, national_id, education_level, phone, home_location, hobbies, req.params.id]);

        const [updatedMember] = await db.query('SELECT * FROM members WHERE id = ?', [req.params.id]);
        res.json(updatedMember[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update member' });
    }
});

// Delete member (pastor only)
router.delete('/:id', authenticate, requireRole(['pastor']), async (req, res) => {
    try {
        await db.query('DELETE FROM members WHERE id = ?', [req.params.id]);
        res.json({ message: 'Member deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete member' });
    }
});

export default router;
