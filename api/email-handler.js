// Serverless function to handle email notifications
// Deploy this to Vercel, Netlify, or similar platforms

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Email content
        const emailData = {
            to: 'shorabtuli@gmail.com',
            subject: 'New Being Well Visitor Signup',
            html: `
                <h2>New Being Well Visitor Signup</h2>
                <p><strong>Visitor Email:</strong> ${email}</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>User Agent:</strong> ${req.headers['user-agent']}</p>
                <p><strong>IP Address:</strong> ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</p>
                <br>
                <p>This visitor is interested in the Being Well RA wellness app.</p>
                <p>You can follow up with them at: <a href="mailto:${email}">${email}</a></p>
            `
        };

        // Using Resend (configured with your API key)
        if (process.env.RESEND_API_KEY) {
            try {
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
                    console.log('Email sent successfully via Resend');
                    return res.status(200).json({ message: 'Email sent successfully' });
                } else {
                    const errorData = await response.json();
                    console.error('Resend API error:', errorData);
                    throw new Error(`Resend API error: ${response.status}`);
                }
            } catch (error) {
                console.error('Error sending email via Resend:', error);
                // Continue to fallback options
            }
        }

        // Fallback: Using SendGrid (if configured)
        if (process.env.SENDGRID_API_KEY) {
            try {
                const sgMail = require('@sendgrid/mail');
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);

                await sgMail.send({
                    to: emailData.to,
                    from: 'noreply@beingwell.health',
                    subject: emailData.subject,
                    html: emailData.html,
                });

                console.log('Email sent successfully via SendGrid');
                return res.status(200).json({ message: 'Email sent successfully' });
            } catch (error) {
                console.error('Error sending email via SendGrid:', error);
                // Continue to fallback options
            }
        }

        // Fallback: Using Gmail (if configured)
        if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
            try {
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

                console.log('Email sent successfully via Gmail');
                return res.status(200).json({ message: 'Email sent successfully' });
            } catch (error) {
                console.error('Error sending email via Gmail:', error);
                // Continue to fallback options
            }
        }

        // Final fallback: Log the email (for development)
        console.log('Email notification (no email service configured):', emailData);
        return res.status(200).json({ message: 'Email logged (no email service configured)' });

    } catch (error) {
        console.error('Error in email handler:', error);
        return res.status(500).json({ message: 'Error sending email' });
    }
} 