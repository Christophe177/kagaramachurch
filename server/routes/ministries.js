import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';
import nodemailer from 'nodemailer';

const router = Router();

// Join Ministry Request
router.post('/join', async (req, res) => {
    try {
        const { full_name, email, phone, ministry_name, message, user_id } = req.body;

        if (!full_name || !email || !ministry_name) {
            return res.status(400).json({ error: 'Name, email, and ministry name are required' });
        }

        const id = uuidv4();
        await db.query(
            'INSERT INTO ministry_applications (id, user_id, full_name, email, phone, ministry_name, message) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, user_id || null, full_name, email, phone, ministry_name, message]
        );

        // Setup Email
        // Note: For production, use secure SMTP settings in .env
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@kagaramachurch.rw',
            to: 'munezeroberthra@gmail.com',
            subject: `New Ministry Join Request: ${ministry_name}`,
            text: `
New Ministry Join Request received!

Name: ${full_name}
Email: ${email}
Phone: ${phone || 'N/A'}
Ministry: ${ministry_name}
Message: ${message || 'No message provided'}

Date: ${new Date().toLocaleString()}
            `
        };

        // Attempt to send email if credentials exist
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                await transporter.sendMail(mailOptions);
                console.log(`Email sent for ${ministry_name} join request`);
            } catch (emailErr) {
                console.error('Email sending failed:', emailErr);
                // We continue as database record is saved
            }
        } else {
            console.log('--- SIMULATED EMAIL NOTIFICATION ---');
            console.log('To: munezeroberthra@gmail.com');
            console.log('Subject:', mailOptions.subject);
            console.log('Body:', mailOptions.text);
            console.log('------------------------------------');
        }

        res.status(201).json({ 
            message: 'Your request has been submitted successfully! We will get back to you soon.' 
        });

    } catch (err) {
        console.error('Ministry join error:', err);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

// Contact Form Submission
router.post('/form', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        // Setup Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@kagaramachurch.rw',
            to: 'munezeroberthra@gmail.com',
            subject: `Contact Form: ${subject || 'New Message'}`,
            text: `
New Contact Message received!

Name: ${name}
Email: ${email}
Subject: ${subject || 'N/A'}
Message: ${message}

Date: ${new Date().toLocaleString()}
            `
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                await transporter.sendMail(mailOptions);
                console.log(`Contact email sent for ${name}`);
            } catch (emailErr) {
                console.error('Contact email failed:', emailErr);
            }
        } else {
            console.log('--- SIMULATED CONTACT EMAIL ---');
            console.log('To: munezeroberthra@gmail.com');
            console.log('Body:', mailOptions.text);
            console.log('-------------------------------');
        }

        res.status(200).json({ message: 'Thank you! Your message has been sent successfully.' });

    } catch (err) {
        console.error('Contact error:', err);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

export default router;
