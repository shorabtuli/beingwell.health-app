// Serverless function to send email notifications
// Deploy this to Vercel, Netlify, or similar platforms

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { visitorEmail } = req.body;

        if (!visitorEmail) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Using a simple email service (you can replace with your preferred service)
        const emailData = {
            to: 'shorabtuli@gmail.com',
            subject: 'New Being Well Visitor Signup',
            html: `
                <h2>New Being Well Visitor Signup</h2>
                <p><strong>Visitor Email:</strong> ${visitorEmail}</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>User Agent:</strong> ${req.headers['user-agent']}</p>
                <p><strong>IP Address:</strong> ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</p>
                <br>
                <p>This visitor is interested in the Being Well RA wellness app.</p>
                <p>You can follow up with them at: ${visitorEmail}</p>
            `
        };

        // Option 1: Using Resend (recommended - free tier available)
        // You'll need to sign up at resend.com and get an API key
        if (process.env.RESEND_API_KEY) {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: 'noreply@beingwell.health',
                    to: emailData.to,
                    subject: emailData.subject,
                    html: emailData.html,
                }),
            });

            if (response.ok) {
                return res.status(200).json({ message: 'Email sent successfully' });
            }
        }

        // Option 2: Using SendGrid (free tier available)
        if (process.env.SENDGRID_API_KEY) {
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);

            await sgMail.send({
                to: emailData.to,
                from: 'noreply@beingwell.health',
                subject: emailData.subject,
                html: emailData.html,
            });

            return res.status(200).json({ message: 'Email sent successfully' });
        }

        // Option 3: Using Nodemailer with Gmail (requires app password)
        if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
            const nodemailer = require('nodemailer');

            const transporter = nodemailer.createTransporter({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS,
                },
            });

            await transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: emailData.to,
                subject: emailData.subject,
                html: emailData.html,
            });

            return res.status(200).json({ message: 'Email sent successfully' });
        }

        // Fallback: Log the email (for development)
        console.log('Email notification:', emailData);
        return res.status(200).json({ message: 'Email logged (no email service configured)' });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email' });
    }
} 