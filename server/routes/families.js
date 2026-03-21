import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// Get all families
router.get('/', authenticate, async (req, res) => {
    try {
        const [families] = await db.query('SELECT * FROM families ORDER BY name');
        
        // Fetch members for each family
        for (let family of families) {
            const [members] = await db.query(`
                SELECT fm.id as fm_id, fm.role, m.* 
                FROM family_members fm
                JOIN members m ON fm.member_id = m.id
                WHERE fm.family_id = ?
            `, [family.id]);
            family.family_members = members;
        }

        res.json(families);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch families' });
    }
});

// Get single family
router.get('/:id', authenticate, async (req, res) => {
    try {
        const [families] = await db.query('SELECT * FROM families WHERE id = ?', [req.params.id]);
        
        if (families.length === 0) return res.status(404).json({ error: 'Family not found' });
        
        const family = families[0];
        
        const [members] = await db.query(`
            SELECT fm.id as fm_id, fm.role, m.* 
            FROM family_members fm
            JOIN members m ON fm.member_id = m.id
            WHERE fm.family_id = ?
        `, [family.id]);
        
        family.family_members = members;
        res.json(family);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch family' });
    }
});

// Create family (manager only)
router.post('/', authenticate, requireRole('manager'), async (req, res) => {
    try {
        const { name, description } = req.body;
        const newFamilyId = uuidv4();

        await db.query(
            'INSERT INTO families (id, name, description) VALUES (?, ?, ?)',
            [newFamilyId, name, description]
        );

        const [newFamily] = await db.query('SELECT * FROM families WHERE id = ?', [newFamilyId]);
        res.status(201).json(newFamily[0]);
    } catch (err) {
        console.error('Create family error:', err);
        res.status(500).json({ error: 'Failed to create family' });
    }
});

// Add member to family (manager only)
router.post('/:id/members', authenticate, requireRole('manager'), async (req, res) => {
    try {
        const { member_id, role } = req.body; // role: 'parent' or 'child'
        const newFamilyMemberId = uuidv4();

        await db.query(`
            INSERT INTO family_members (id, family_id, member_id, role)
            VALUES (?, ?, ?, ?)
        `, [newFamilyMemberId, req.params.id, member_id, role]);

        const [newMember] = await db.query('SELECT * FROM family_members WHERE id = ?', [newFamilyMemberId]);
        res.status(201).json(newMember[0]);
    } catch (err) {
        console.error('Add family member error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'This member is already in this family' });
        }
        res.status(500).json({ error: 'Failed to add member to family' });
    }
});

// Submit deletion request (parent requesting child deletion)
router.post('/deletion-request', authenticate, async (req, res) => {
    try {
        const { child_member_id, family_id, reason } = req.body;
        const newRequestId = uuidv4();

        await db.query(`
            INSERT INTO deletion_requests (id, requested_by, child_member_id, family_id, reason, status)
            VALUES (?, ?, ?, ?, ?, 'pending')
        `, [newRequestId, req.user.id, child_member_id, family_id, reason]);

        const [newRequest] = await db.query('SELECT * FROM deletion_requests WHERE id = ?', [newRequestId]);
        res.status(201).json(newRequest[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit deletion request' });
    }
});

// Get all deletion requests (manager only)
router.get('/deletion-requests/all', authenticate, requireRole('manager'), async (req, res) => {
    try {
        const [requests] = await db.query(`
            SELECT dr.*, m.full_name as child_name, f.name as family_name 
            FROM deletion_requests dr
            LEFT JOIN members m ON dr.child_member_id = m.id
            LEFT JOIN families f ON dr.family_id = f.id
            ORDER BY dr.created_at DESC
        `);
        
        // Format to match old Supabase response structure where possible
        const formattedRequests = requests.map(req => ({
            ...req,
            members: { full_name: req.child_name },
            families: { name: req.family_name }
        }));

        res.json(formattedRequests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch deletion requests' });
    }
});

// Approve/Reject deletion request (manager only)
router.put('/deletion-request/:id', authenticate, requireRole('manager'), async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        
        const [requests] = await db.query('SELECT * FROM deletion_requests WHERE id = ?', [req.params.id]);
        if (requests.length === 0) return res.status(404).json({ error: 'Request not found' });
        
        const request = requests[0];

        if (status === 'approved') {
            await db.query(
                'DELETE FROM family_members WHERE member_id = ? AND family_id = ?',
                [request.child_member_id, request.family_id]
            );
        }

        await db.query(
            'UPDATE deletion_requests SET status = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, req.params.id]
        );

        const [updatedRequest] = await db.query('SELECT * FROM deletion_requests WHERE id = ?', [req.params.id]);
        res.json(updatedRequest[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to process request' });
    }
});

// Update member role in family (manager only)
router.patch('/:id/members/:memberId', authenticate, requireRole('manager'), async (req, res) => {
    try {
        const { role } = req.body;
        
        await db.query(
            'UPDATE family_members SET role = ? WHERE family_id = ? AND member_id = ?',
            [role, req.params.id, req.params.memberId]
        );

        const [updatedMember] = await db.query(
            'SELECT * FROM family_members WHERE family_id = ? AND member_id = ?',
            [req.params.id, req.params.memberId]
        );
        res.json(updatedMember[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update member role' });
    }
});

// Remove member from family (manager only)
router.delete('/:id/members/:memberId', authenticate, requireRole('manager'), async (req, res) => {
    try {
        await db.query(
            'DELETE FROM family_members WHERE family_id = ? AND member_id = ?',
            [req.params.id, req.params.memberId]
        );
        res.json({ message: 'Member removed from family' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove member' });
    }
});

// Delete family (manager only)
router.delete('/:id', authenticate, requireRole('manager'), async (req, res) => {
    try {
        await db.query('DELETE FROM families WHERE id = ?', [req.params.id]);
        res.json({ message: 'Family deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete family' });
    }
});

export default router;
