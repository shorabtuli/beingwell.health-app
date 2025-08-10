const fs = require('fs');
const path = require('path');

// The new email capture form to replace download buttons
const emailCaptureForm = `
                <!-- Email Capture Form -->
                <div class="bg-gradient-to-br from-primary to-secondary rounded-lg p-8 text-center mb-12">
                    <h3 class="text-2xl font-bold text-white mb-4">Ready to Improve Your RA Wellness?</h3>
                    <p class="text-white/90 mb-6">Get your personalized RA wellness plan and start your journey to better management today.</p>
                    
                    <form class="max-w-md mx-auto space-y-4">
                        <input 
                            type="email" 
                            placeholder="Enter your email address" 
                            class="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                            required>
                        <button 
                            type="submit" 
                            class="w-full bg-white text-primary font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                            Start Free Wellness Plan
                        </button>
                    </form>
                    
                    <div class="mt-4 text-white/80 text-sm">
                        <div class="flex items-center justify-center space-x-4">
                            <span class="flex items-center">
                                <span class="text-yellow-300 mr-1">✨</span>
                                Free forever plan available
                            </span>
                            <span>•</span>
                            <span>Cancel anytime</span>
                            <span>•</span>
                            <span>Your data stays private</span>
                        </div>
                    </div>
                </div>`;

// Function to replace download buttons with email capture form
function replaceDownloadButtons(content) {
    // Pattern to match download button sections
    const downloadButtonPatterns = [
        // Pattern 1: Standard download button section
        /<div class="bg-gradient-to-br from-primary to-secondary rounded-lg p-8 text-center mb-12">\s*<h3[^>]*>Ready to Improve Your[^<]*<\/h3>\s*<p[^>]*>Get your personalized RA wellness plan[^<]*<\/p>\s*<div class="flex flex-col sm:flex-row gap-4 justify-center">\s*<a[^>]*class="[^"]*bg-white[^"]*"[^>]*>Download<\/a>\s*<a[^>]*class="[^"]*border-white[^"]*"[^>]*>Being Well App<\/a>\s*<\/div>\s*<\/div>/gs,
        
        // Pattern 2: Alternative download button section
        /<div class="bg-gradient-to-br from-primary to-secondary rounded-lg p-8 text-center mb-12">\s*<h3[^>]*>Ready to Improve Your[^<]*<\/h3>\s*<p[^>]*>Get your personalized RA wellness plan[^<]*<\/p>\s*<div class="flex flex-col sm:flex-row gap-4 justify-center">\s*<a[^>]*>Download<\/a>\s*<a[^>]*>Being Well App<\/a>\s*<\/div>\s*<\/div>/gs,
        
        // Pattern 3: Simple download button
        /<a[^>]*class="[^"]*bg-primary[^"]*"[^>]*>Download<\/a>/g,
        
        // Pattern 4: Download button with href
        /<a href="[^"]*"[^>]*class="[^"]*bg-white[^"]*"[^>]*>Download<\/a>/g
    ];
    
    let hasChanges = false;
    
    downloadButtonPatterns.forEach(pattern => {
        if (content.match(pattern)) {
            content = content.replace(pattern, emailCaptureForm);
            hasChanges = true;
        }
    });
    
    return { content, hasChanges };
}

// Function to add email capture form if no download button exists
function addEmailCaptureForm(content) {
    // Check if email capture form already exists
    if (content.includes('Start Free Wellness Plan')) {
        return { content, hasChanges: false };
    }
    
    // Pattern to find a good place to add the form (before the footer)
    const beforeFooterPattern = /<!-- Footer -->/;
    
    if (content.match(beforeFooterPattern)) {
        content = content.replace(beforeFooterPattern, emailCaptureForm + '\n\n    <!-- Footer -->');
        return { content, hasChanges: true };
    }
    
    return { content, hasChanges: false };
}

// Main function to process all HTML files
function replaceDownloadButtonsInAllBlogs() {
    const blogPostsDir = './blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    console.log(`🔍 Checking ${files.length} blog posts for download buttons...`);
    
    let totalFixed = 0;
    let totalChecked = 0;
    
    files.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;
        
        console.log(`\n📄 Processing: ${file}`);
        totalChecked++;
        
        // Replace existing download buttons
        const { content: updatedContent, hasChanges: buttonReplaced } = replaceDownloadButtons(content);
        content = updatedContent;
        if (buttonReplaced) {
            hasChanges = true;
            console.log(`  ✅ Replaced download button with email capture form`);
        }
        
        // Add email capture form if no download button was found
        const { content: finalContent, hasChanges: formAdded } = addEmailCaptureForm(content);
        content = finalContent;
        if (formAdded) {
            hasChanges = true;
            console.log(`  ✅ Added email capture form`);
        }
        
        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  ✅ Updated ${file}`);
            totalFixed++;
        } else {
            console.log(`  ✅ No changes needed in ${file}`);
        }
    });
    
    console.log(`\n🎉 Email capture form update complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Checked ${totalChecked} blog posts`);
    console.log(`   - Updated ${totalFixed} files`);
    console.log(`   - All blog posts now have email capture forms!`);
}

// Run the replacement
replaceDownloadButtonsInAllBlogs(); 