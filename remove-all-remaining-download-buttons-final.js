const fs = require('fs');
const path = require('path');

// Function to remove ALL download button sections
function removeAllDownloadSections(content) {
    let hasChanges = false;
    
    // Pattern 1: Remove any section containing download button links
    const downloadLinkPattern = /<a href="[^"]*#download"[^>]*class="[^"]*bg-white[^"]*"[^>]*>[\s\S]*?<\/a>/g;
    
    if (content.match(downloadLinkPattern)) {
        content = content.replace(downloadLinkPattern, '');
        hasChanges = true;
    }
    
    // Pattern 2: Remove any section with "Ready to Improve Your" and download link
    const ctaDownloadPattern = /<!-- CTA Section -->\s*<div[^>]*>[\s\S]*?Ready to Improve Your[\s\S]*?<a[^>]*#download[^>]*>[\s\S]*?<\/div>/gs;
    
    if (content.match(ctaDownloadPattern)) {
        content = content.replace(ctaDownloadPattern, '');
        hasChanges = true;
    }
    
    // Pattern 3: Remove any div with download button
    const divDownloadPattern = /<div[^>]*>[\s\S]*?<a[^>]*#download[^>]*>[\s\S]*?<\/div>/gs;
    
    if (content.match(divDownloadPattern)) {
        content = content.replace(divDownloadPattern, '');
        hasChanges = true;
    }
    
    // Pattern 4: Remove any remaining download button sections
    const remainingDownloadPattern = /<a[^>]*href="[^"]*#download"[^>]*>[\s\S]*?<\/a>/g;
    
    if (content.match(remainingDownloadPattern)) {
        content = content.replace(remainingDownloadPattern, '');
        hasChanges = true;
    }
    
    // Pattern 5: Remove any section with "Ready to Improve Your" and any download reference
    const readyImprovePattern = /<div[^>]*>[\s\S]*?Ready to Improve Your[\s\S]*?<a[^>]*download[^>]*>[\s\S]*?<\/div>/gs;
    
    if (content.match(readyImprovePattern)) {
        content = content.replace(readyImprovePattern, '');
        hasChanges = true;
    }
    
    return { content, hasChanges };
}

// Main function to process all HTML files
function removeAllRemainingDownloadButtons() {
    const blogPostsDir = './blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    console.log(`🔍 Checking ${files.length} blog posts for ALL remaining download button sections...`);
    
    let totalFixed = 0;
    let totalChecked = 0;
    
    files.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Process all files that contain download references
        if (content.includes('#download') || content.includes('Download') || content.includes('Being Well App')) {
            console.log(`\n📄 Processing: ${file}`);
            totalChecked++;
            
            // Remove download sections
            const { content: updatedContent, hasChanges } = removeAllDownloadSections(content);
            content = updatedContent;
            
            if (hasChanges) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`  ✅ Removed download button section from ${file}`);
                totalFixed++;
            } else {
                console.log(`  ✅ No download sections found in ${file}`);
            }
        }
    });
    
    console.log(`\n🎉 All remaining download button section removal complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Checked ${totalChecked} blog posts with download buttons`);
    console.log(`   - Removed download sections from ${totalFixed} files`);
    console.log(`   - All download button sections have been removed!`);
}

// Run the removal
removeAllRemainingDownloadButtons(); 