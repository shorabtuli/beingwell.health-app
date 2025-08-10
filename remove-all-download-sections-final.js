const fs = require('fs');
const path = require('path');

// Function to remove download button sections
function removeDownloadSections(content) {
    let hasChanges = false;
    
    // Pattern 1: Remove the standard CTA Section with download button
    const downloadSectionPattern = /<!-- CTA Section -->\s*<div class="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white text-center mb-12">\s*<h3[^>]*>Ready to Improve Your[^<]*<\/h3>\s*<p[^>]*>Get your personalized RA wellness plan[^<]*<\/p>\s*<a[^>]*>Download[^<]*<\/a>\s*<\/div>/gs;
    
    if (content.match(downloadSectionPattern)) {
        content = content.replace(downloadSectionPattern, '');
        hasChanges = true;
    }
    
    // Pattern 2: Remove without the comment
    const downloadSectionPattern2 = /<div class="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white text-center mb-12">\s*<h3[^>]*>Ready to Improve Your[^<]*<\/h3>\s*<p[^>]*>Get your personalized RA wellness plan[^<]*<\/p>\s*<a[^>]*>Download[^<]*<\/a>\s*<\/div>/gs;
    
    if (content.match(downloadSectionPattern2)) {
        content = content.replace(downloadSectionPattern2, '');
        hasChanges = true;
    }
    
    // Pattern 3: Remove any div with download button and "Being Well App"
    const downloadSectionPattern3 = /<div[^>]*class="[^"]*bg-gradient[^"]*"[^>]*>\s*<h3[^>]*>Ready to Improve Your[^<]*<\/h3>\s*<p[^>]*>Get your personalized RA wellness plan[^<]*<\/p>\s*<a[^>]*>Download[^<]*<\/a>\s*<\/div>/gs;
    
    if (content.match(downloadSectionPattern3)) {
        content = content.replace(downloadSectionPattern3, '');
        hasChanges = true;
    }
    
    // Pattern 4: Remove sections with "Download" and "Being Well App" buttons
    const downloadSectionPattern4 = /<div[^>]*class="[^"]*bg-gradient[^"]*"[^>]*>\s*<h3[^>]*>Ready to Improve Your[^<]*<\/h3>\s*<p[^>]*>Get your personalized RA wellness plan[^<]*<\/p>\s*<a[^>]*>Download[^<]*<\/a>\s*<a[^>]*>Being Well App<\/a>\s*<\/div>/gs;
    
    if (content.match(downloadSectionPattern4)) {
        content = content.replace(downloadSectionPattern4, '');
        hasChanges = true;
    }
    
    // Pattern 5: Remove any section containing both "Download" and "Being Well App"
    const downloadSectionPattern5 = /<div[^>]*class="[^"]*bg-gradient[^"]*"[^>]*>[\s\S]*?Download[\s\S]*?Being Well App[\s\S]*?<\/div>/gs;
    
    if (content.match(downloadSectionPattern5)) {
        content = content.replace(downloadSectionPattern5, '');
        hasChanges = true;
    }
    
    // Pattern 6: Remove footer download links
    const footerDownloadPattern = /<li><a href="[^"]*#download"[^>]*>Download App<\/a><\/li>/g;
    
    if (content.match(footerDownloadPattern)) {
        content = content.replace(footerDownloadPattern, '');
        hasChanges = true;
    }
    
    // Pattern 7: Remove any remaining download button sections
    const remainingDownloadPattern = /<a[^>]*>Download[^<]*<\/a>\s*<a[^>]*>Being Well App<\/a>/g;
    
    if (content.match(remainingDownloadPattern)) {
        content = content.replace(remainingDownloadPattern, '');
        hasChanges = true;
    }
    
    return { content, hasChanges };
}

// Main function to process all HTML files
function removeAllDownloadSections() {
    const blogPostsDir = './blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    console.log(`🔍 Checking ${files.length} blog posts for ALL download button sections to remove...`);
    
    let totalFixed = 0;
    let totalChecked = 0;
    
    files.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Process all files that contain "Download" or "Being Well App"
        if (content.includes('Download') || content.includes('Being Well App')) {
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
                console.log(`  ✅ No download sections found in ${file}`);
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