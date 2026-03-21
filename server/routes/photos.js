import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import { db } from '../config/db.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images and videos are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

// Get latest photo of the day
router.get('/', async (req, res) => {
    try {
        const [photos] = await db.query('SELECT * FROM photo_of_day ORDER BY created_at DESC');
        // Map to include full URL if needed
        res.json(photos);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch photos' });
    }
});

// Post photo of the day (manager only)
router.post('/', authenticate, requireRole('manager'), upload.single('media'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { title, caption } = req.body;
        const newPhotoId = uuidv4();
        const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
        const filePath = `/uploads/${req.file.filename}`;

        await db.query(`
            INSERT INTO photo_of_day (id, title, media_type, file_path, caption, posted_by)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [newPhotoId, title, mediaType, filePath, caption, req.user.id]);

        const [newPhoto] = await db.query('SELECT * FROM photo_of_day WHERE id = ?', [newPhotoId]);
        res.status(201).json(newPhoto[0]);
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Failed to post media' });
    }
});

// Delete photo
router.delete('/:id', authenticate, requireRole('manager'), async (req, res) => {
    try {
        await db.query('DELETE FROM photo_of_day WHERE id = ?', [req.params.id]);
        res.json({ message: 'Photo deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete photo' });
    }
});

export default router;
