import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Route imports
import authRoutes from './routes/auth.js';
import memberRoutes from './routes/members.js';
import familyRoutes from './routes/families.js';
import eventRoutes from './routes/events.js';
import announcementRoutes from './routes/announcements.js';
import photoRoutes from './routes/photos.js';
import prayerRoutes from './routes/prayerRequests.js';
import appointmentRoutes from './routes/appointments.js';
import baptismRoutes from './routes/baptism.js';
import marriageRoutes from './routes/marriage.js';
import ministryRoutes from './routes/ministries.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/families', familyRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/prayer-requests', prayerRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/baptism', baptismRoutes);
app.use('/api/marriage', marriageRoutes);
app.use('/api/ministries', ministryRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Church CMS API is running' });
});

app.listen(PORT, () => {
    console.log(`🏛️ Church CMS Server running on port ${PORT}`);
});
