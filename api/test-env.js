// Test environment variables
export default async function handler(req, res) {
    return res.status(200).json({
        message: 'Environment test',
        hasResendKey: !!process.env.RESEND_API_KEY,
        resendKeyLength: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0,
        allEnvVars: Object.keys(process.env).filter(key => key.includes('RESEND'))
    });
} 