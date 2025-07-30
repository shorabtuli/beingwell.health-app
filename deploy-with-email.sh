#!/bin/bash

# Being Well - Vercel Deployment with Email Setup
echo "🚀 Deploying Being Well website to Vercel with email functionality..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

# Set up environment variables
echo "🔑 Setting up Resend API key..."
vercel env add RESEND_API_KEY production <<< "re_VRDXDWrQ_JXmk2YJCaMQTgDom9TtTqtib"

# Deploy to Vercel
echo "🌐 Deploying website with email functionality..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📊 Your website is now live with email notifications!"
echo "🔗 Check your Vercel dashboard for the URL"
echo ""
echo "📧 Email notifications will be sent to: shorabtuli@gmail.com"
echo ""
echo "🧪 Test the email functionality:"
echo "1. Visit your deployed site"
echo "2. Enter an email in the form"
echo "3. Click 'Start Free Wellness Plan'"
echo "4. Check shorabtuli@gmail.com for the notification"
echo ""
echo "📈 Next steps:"
echo "1. Set up custom domain (optional)"
echo "2. Submit sitemap to Google Search Console"
echo "3. Monitor analytics in Vercel dashboard"
echo "4. Check email notifications for new signups" 