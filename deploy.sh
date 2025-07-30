#!/bin/bash

# Being Well - Vercel Deployment Script
echo "🚀 Deploying Being Well website to Vercel..."

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

# Deploy to Vercel
echo "🌐 Deploying website..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📊 Your website is now live!"
echo "🔗 Check your Vercel dashboard for the URL"
echo ""
echo "📈 Next steps:"
echo "1. Set up custom domain (optional)"
echo "2. Configure email notifications"
echo "3. Submit sitemap to Google Search Console"
echo "4. Monitor analytics in Vercel dashboard" 