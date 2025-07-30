# Simple Email Setup for Being Well

## 🎯 Goal
Automatically send email notifications to shorabtuli@gmail.com when visitors sign up, without any user interaction.

## ✅ Solution Options (Choose One)

### Option 1: Resend (Recommended - Free & Easy)
1. **Sign up at [resend.com](https://resend.com)** (free tier: 3,000 emails/month)
2. **Get your API key** from the dashboard
3. **Add to Vercel environment variables:**
   ```
   RESEND_API_KEY=your_api_key_here
   ```

### Option 2: SendGrid (Free Tier Available)
1. **Sign up at [sendgrid.com](https://sendgrid.com)** (free tier: 100 emails/day)
2. **Get your API key** from the dashboard
3. **Add to Vercel environment variables:**
   ```
   SENDGRID_API_KEY=your_api_key_here
   ```

### Option 3: Gmail (Free but requires setup)
1. **Enable 2-factor authentication** on your Gmail
2. **Generate an app password** for your app
3. **Add to Vercel environment variables:**
   ```
   GMAIL_USER=shorabtuli@gmail.com
   GMAIL_PASS=your_app_password_here
   ```

## 🚀 Deploy to Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Add email functionality"
git remote add origin https://github.com/yourusername/being-well-website.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Add environment variables** (see options above)
5. **Deploy**

### Step 3: Test
1. **Visit your deployed site**
2. **Submit an email** in the form
3. **Check shorabtuli@gmail.com** for the notification

## 📧 What You'll Receive

```
Subject: New Being Well Visitor Signup
From: noreply@beingwell.health
To: shorabtuli@gmail.com

New Being Well Visitor Signup

Visitor Email: visitor@example.com
Timestamp: 1/15/2024, 2:30:45 PM
User Agent: Mozilla/5.0...
IP Address: 192.168.1.1

This visitor is interested in the Being Well RA wellness app.
You can follow up with them at: visitor@example.com
```

## 🔧 How It Works

1. **Visitor enters email** and clicks "Start Free Wellness Plan"
2. **Form submits** to `/api/email-handler`
3. **Serverless function** sends email to shorabtuli@gmail.com
4. **Visitor sees success message** - no email client opens
5. **You get instant notification** in your inbox

## 🎯 Benefits

- ✅ **No user interaction required** - completely seamless
- ✅ **Instant notifications** - you know immediately when someone signs up
- ✅ **Professional appearance** - visitors see a clean success message
- ✅ **Reliable delivery** - uses professional email services
- ✅ **Easy to manage** - all notifications go to your inbox

## 🚨 Troubleshooting

### If emails aren't sending:
1. **Check Vercel logs** for errors
2. **Verify environment variables** are set correctly
3. **Test with a different email service** (try Resend if SendGrid fails)
4. **Check spam folder** - emails might be filtered

### If you need immediate testing:
The system includes a **local storage fallback** - emails are stored in the browser and can be viewed in the browser console.

## 📊 Expected Results

- **Immediate notifications** for every signup
- **Professional user experience** - no email client popups
- **Easy follow-up** - you have visitor emails ready to contact
- **Scalable solution** - works with thousands of signups

Choose **Resend** for the easiest setup - it's free and reliable! 🚀 