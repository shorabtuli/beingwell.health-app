const fs = require('fs');
const path = require('path');

// Function to fix "Being Well vs [App]" titles to have consistent font sizes
function fixBeingWellTitles(content) {
    let hasChanges = false;
    
    // Pattern: Fix main h1 title with "Being Well" link and plain text after
    const h1Pattern = /<h1[^>]*>\s*<a[^>]*>Being Well<\/a>\s+vs\s+([^<]+)<\/h1>/g;
    content = content.replace(h1Pattern, (match, appName) => {
        hasChanges = true;
        return `<h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    <a href="../index.html" class="text-purple-600 hover:text-purple-800 underline" onclick="trackInternalNav('../index.html')">Being Well</a> vs <span class="text-purple-600">${appName.trim()}</span>
                </h1>`;
    });
    
    return { content, hasChanges };
}

// Main function to process all HTML files
function fixAllBeingWellTitles() {
    const blogPostsDir = './blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    console.log(`🔍 Checking ${files.length} blog posts for "Being Well vs" title consistency...`);
    
    let totalFixed = 0;
    let totalChecked = 0;
    
    files.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Only process files that contain "Being Well" link followed by "vs"
        if (content.includes('<a') && content.includes('Being Well</a>') && content.includes('vs')) {
            console.log(`\n📄 Processing: ${file}`);
            totalChecked++;
            
            // Fix titles
            const { content: updatedContent, hasChanges } = fixBeingWellTitles(content);
            content = updatedContent;
            
            if (hasChanges) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`  ✅ Fixed title consistency in ${file}`);
                totalFixed++;
            } else {
                console.log(`  ✅ No title changes needed in ${file}`);
            }
        }
    });
    
    console.log(`\n🎉 "Being Well vs" title consistency update complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Checked ${totalChecked} "Being Well vs" blog posts`);
    console.log(`   - Fixed titles in ${totalFixed} files`);
    console.log(`   - All "Being Well vs" titles now have consistent font sizes!`);
}

// Run the fix
fixAllBeingWellTitles(); 