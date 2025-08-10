const fs = require('fs');
const path = require('path');

// Function to remove download button sections
function removeDownloadSections(content) {
    let hasChanges = false;
    
    // Pattern: Remove the CTA Section with download button - exact match
    const downloadSectionPattern = /<!-- CTA Section -->\s*<div class="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white text-center mb-12">\s*<h3[^>]*>Ready to Improve Your[^<]*<\/h3>\s*<p[^>]*>Get your personalized RA wellness plan[^<]*<\/p>\s*<a[^>]*>Download Being Well App<\/a>\s*<\/div>/gs;
    
    if (content.match(downloadSectionPattern)) {
        content = content.replace(downloadSectionPattern, '');
        hasChanges = true;
    }
    
    return { content, hasChanges };
}

// Main function to process all HTML files
function removeAllDownloadSections() {
    const blogPostsDir = './blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    console.log(`🔍 Checking ${files.length} blog posts for download button sections to remove...`);
    
    let totalFixed = 0;
    let totalChecked = 0;
    
    files.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Only process files that contain "Download Being Well App"
        if (content.includes('Download Being Well App')) {
            console.log(`\n📄 Processing: ${file}`);
            totalChecked++;
            
            // Remove download sections
            const { content: updatedContent, hasChanges } = removeDownloadSections(content);
            content = updatedContent;
            
            if (hasChanges) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`  ✅ Removed download button section from ${file}`);
                totalFixed++;
            } else {
                console.log(`  ❌ Could not find exact pattern in ${file}`);
            }
        }
    });
    
    console.log(`\n🎉 Download button section removal complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Checked ${totalChecked} blog posts with download buttons`);
    console.log(`   - Removed download sections from ${totalFixed} files`);
    console.log(`   - All download button sections have been removed!`);
}

// Run the removal
removeAllDownloadSections(); 