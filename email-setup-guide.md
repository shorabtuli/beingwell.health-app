# Email Setup Guide for Being Well

## 🚨 Current Issue
You're getting "Form not found" because the Formspree form ID doesn't exist. Let's fix this!

## ✅ Step-by-Step Setup

### 1. Create Formspree Account
1. Go to [formspree.io](https://formspree.io)
2. Click "Sign Up" (free tier available)
3. Create account with your email: **shorabtuli@gmail.com**

### 2. Create New Form
1. After logging in, click "New Form"
2. Give it a name: "Being Well Visitor Signups"
3. Copy your **Form ID** (looks like `xrgjqkzw` but will be different)

### 3. Update Your Landing Page
Replace the form action in `index.html` with your actual Form ID:

```html
<form action="https://formspree.io/f/YOUR_ACTUAL_FORM_ID" method="POST" id="email-form" class="max-w-md mx-auto space-y-4">
    <input type="email" name="email" id="visitor-email" placeholder="Enter your email address" required class="w-full px-6 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
    <input type="hidden" name="_subject" value="New Being Well Visitor Signup">
    <input type="hidden" name="_replyto" value="shorabtuli@gmail.com">
    <input type="hidden" name="message" value="A new visitor has signed up for the Being Well wellness plan!">
    <button type="submit" class="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
        Start Free Wellness Plan
    </button>
</form>
```

### 4. Test the Setup
1. Update your form with the correct Form ID
2. Submit a test email
3. Check your inbox at **shorabtuli@gmail.com**

## 🎯 Alternative: Quick Mailto Solution

If you want something that works immediately without setup:

```html
<form onsubmit="sendMailto(event)" class="max-w-md mx-auto space-y-4">
    <input type="email" id="visitor-email" placeholder="Enter your email address" required class="w-full px-6 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
    <button type="submit" class="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
        Start Free Wellness Plan
    </button>
</form>

<script>
function sendMailto(e) {
    e.preventDefault();
    const email = document.getElementById('visitor-email').value;
    const subject = encodeURIComponent('New Being Well Visitor Signup');
    const body = encodeURIComponent(`A new visitor has signed up for the Being Well wellness plan!\n\nVisitor Email: ${email}\n\nTimestamp: ${new Date().toLocaleString()}`);
    
    window.location.href = `mailto:shorabtuli@gmail.com?subject=${subject}&body=${body}`;
}
</script>
```

## 📧 What You'll Receive

Once set up correctly, you'll get emails like this:

```
Subject: New Being Well Visitor Signup
From: noreply@formspree.io
To: shorabtuli@gmail.com

A new visitor has signed up for the Being Well wellness plan!

Visitor Email: visitor@example.com
Timestamp: 1/15/2024, 2:30:45 PM

This visitor is interested in the Being Well RA wellness app.
```

## 🔧 Need Help?

1. **Formspree not working?** Try the mailto solution above
2. **Still having issues?** Let me know and I'll create a different solution
3. **Want to test first?** Use the test-email.html file I created

Which option would you like to try first? 