// Serverless function to send email notifications
// Deploy this to Vercel, Netlify, or similar platforms
// Updated: Force redeploy to fix 404 error - Vercel deployment test

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { visitorEmail } = req.body;

        if (!visitorEmail) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Using Resend for email notifications
        const emailData = {
            to: 'shorabtuli1975@gmail.com', // Use your verified email address
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

        // Using Resend (free tier available)
        if (process.env.RESEND_API_KEY) {
            try {
                const response = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        from: 'onboarding@resend.dev', // Use Resend's default domain
                        to: emailData.to,
                        subject: emailData.subject,
                        html: emailData.html,
                    }),
                });

                const responseData = await response.json();
                
                if (response.ok) {
                    return res.status(200).json({ message: 'Email sent successfully', resendId: responseData.id });
                } else {
                    console.error('Resend API error:', responseData);
                    return res.status(500).json({ message: 'Resend API error', error: responseData });
                }
            } catch (error) {
                console.error('Resend fetch error:', error);
                return res.status(500).json({ message: 'Resend fetch error', error: error.message });
            }
        }

        // Fallback: Log the email (for development)
        console.log('Email notification:', emailData);
        return res.status(200).json({ message: 'Email logged (no email service configured)' });

    } catch (error) {
        console.error('API error:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}; 