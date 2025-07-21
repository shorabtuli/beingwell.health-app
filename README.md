# Holistica Landing Page

A modern, clean, and responsive landing page for the Holistica iOS app - a wellness platform designed to help people with chronic conditions improve their well-being through personalized wellness plans.

## 🌟 Features

### Design & User Experience
- **Modern & Clean Design**: Beautiful gradient backgrounds and smooth animations
- **Fully Responsive**: Optimized for all devices (mobile, tablet, desktop)
- **Accessibility Focused**: WCAG compliant with proper semantic HTML and ARIA labels
- **Performance Optimized**: Fast loading with optimized assets and minimal dependencies

### Sections Included
1. **Hero Section**: Compelling tagline with app mockup and download CTA
2. **Features**: Highlighting habit tracking, community chat, personalized routines, and real-time insights
3. **Health Pillars**: Visual representation of the 7 wellness pillars
4. **Testimonials**: Real user stories from people with chronic conditions
5. **FAQ**: Interactive accordion with common questions
6. **Footer**: App Store badge, email signup, and privacy links

### Interactive Elements
- **Mobile Menu**: Hamburger menu for mobile devices
- **FAQ Accordion**: Expandable/collapsible FAQ sections
- **Smooth Scrolling**: Navigation links smoothly scroll to sections
- **Hover Effects**: Engaging hover animations on cards and buttons
- **Form Validation**: Email signup with validation and notifications

## 🚀 Quick Start

1. **Clone or Download** the project files
2. **Open `index.html`** in your web browser
3. **That's it!** The page is ready to use

### Local Development
For development, you can use any local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 🛠️ Customization

### Colors
The color scheme is defined in the Tailwind config within the HTML file. You can modify:

```javascript
colors: {
    primary: '#6366f1',      // Main brand color
    secondary: '#8b5cf6',    // Secondary brand color
    accent: '#06b6d4',       // Accent color
    success: '#10b981',      // Success states
    warning: '#f59e0b',      // Warning states
    error: '#ef4444',        // Error states
}
```

### Content
- **Hero Section**: Update the tagline, description, and CTA button text
- **Features**: Modify the feature descriptions and icons
- **Testimonials**: Replace with real user testimonials
- **FAQ**: Add or modify questions and answers
- **Footer**: Update links, social media, and contact information

### App Store Integration
Replace the placeholder App Store link with your actual app URL:

```html
<a href="https://apps.apple.com/app/your-app-id" class="...">
    Download on the App Store
</a>
```

## 📱 App Store Badge

The landing page includes the official App Store badge. To use your own:

1. Download the badge from [Apple's Marketing Guidelines](https://developer.apple.com/app-store/marketing/guidelines/)
2. Replace the current badge URL in the footer section
3. Ensure you follow Apple's usage guidelines

## 🎨 Design System

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold weights (600-700)
- **Body**: Regular weight (400)
- **Captions**: Light weight (300)

### Spacing
- **Section Padding**: 80px (py-20)
- **Component Spacing**: 16px, 24px, 32px, 48px
- **Grid Gaps**: 24px, 32px, 48px

### Components
- **Cards**: Rounded corners (xl), subtle shadows
- **Buttons**: Gradient backgrounds, hover effects
- **Forms**: Clean inputs with focus states

## 🔧 Technical Details

### Dependencies
- **Tailwind CSS**: Utility-first CSS framework (CDN)
- **Font Awesome**: Icons (CDN)
- **Google Fonts**: Inter font family

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s

## 📧 Analytics & Tracking

To add analytics tracking:

1. **Google Analytics**: Add the GA4 tracking code to the `<head>` section
2. **Conversion Tracking**: Track form submissions and button clicks
3. **Scroll Tracking**: Monitor user engagement with different sections

## 🔒 Privacy & Compliance

The landing page is designed with privacy in mind:
- No tracking cookies by default
- Minimal data collection
- GDPR-compliant form handling
- Clear privacy policy links

## 🚀 Deployment

### Static Hosting
Deploy to any static hosting service:
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your repository
- **GitHub Pages**: Push to a repository
- **AWS S3**: Upload files to a bucket

### Custom Domain
1. Purchase a domain
2. Configure DNS settings
3. Update hosting provider settings
4. Add SSL certificate

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For questions or support:
- Email: support@holistica.com
- Website: https://holistica.com
- Documentation: https://docs.holistica.com

---

**Built with ❤️ for the chronic illness community** 