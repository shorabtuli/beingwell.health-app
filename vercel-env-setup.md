# Vercel Environment Setup for Being Well

## 🔑 Your Resend API Key
```
RESEND_API_KEY=re_VRDXDWrQ_JXmk2YJCaMQTgDom9TtTqtib
```

## 🚀 Deploy to Vercel with Email Functionality

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Add email functionality with Resend"
git remote add origin https://github.com/yourusername/being-well-website.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Add Environment Variable:**
   - **Name:** `RESEND_API_KEY`
   - **Value:** `re_VRDXDWrQ_JXmk2YJCaMQTgDom9TtTqtib`
5. **Deploy**

### Step 3: Test Email Functionality
1. **Visit your deployed site**
2. **Enter an email** in the form
3. **Click "Start Free Wellness Plan"**
4. **Check shorabtuli@gmail.com** for the notification

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

## ✅ Benefits of This Setup

- **Automatic email notifications** - no user interaction required
- **Professional delivery** - uses Resend's reliable email service
- **Instant notifications** - you know immediately when someone signs up
- **Clean user experience** - visitors see success message, no email client opens
- **Easy follow-up** - visitor emails ready to contact

## 🔧 Troubleshooting

### If emails aren't sending:
1. **Check Vercel logs** for errors
2. **Verify environment variable** is set correctly
3. **Check spam folder** - emails might be filtered
4. **Test with a different email** to ensure delivery

### If you need to update the API key:
1. **Go to Vercel dashboard**
2. **Navigate to your project**
3. **Go to Settings > Environment Variables**
4. **Update the RESEND_API_KEY value**

## 📊 Expected Results

- **Immediate notifications** for every signup
- **Professional user experience** - no email client popups
- **Easy follow-up** - you have visitor emails ready to contact
- **Scalable solution** - works with thousands of signups

Your email notifications are now ready to go! 🚀 