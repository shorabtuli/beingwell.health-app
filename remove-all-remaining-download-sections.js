const fs = require('fs');
const path = require('path');

// Function to remove ALL download button sections
function removeAllDownloadSections(content) {
    let hasChanges = false;
    
    // Pattern 1: Remove any section containing "Download" and "Being Well App"
    const downloadSectionPattern = /<a[^>]*>Download[^<]*<\/a>\s*<a[^>]*>Being Well<\/a>\s*App/g;
    
    if (content.match(downloadSectionPattern)) {
        content = content.replace(downloadSectionPattern, '');
        hasChanges = true;
    }
    
    // Pattern 2: Remove footer download links
    const footerDownloadPattern = /<li><a href="[^"]*#download"[^>]*>Download App<\/a><\/li>/g;
    
    if (content.match(footerDownloadPattern)) {
        content = content.replace(footerDownloadPattern, '');
        hasChanges = true;
    }
    
    // Pattern 3: Remove any remaining download button sections
    const remainingDownloadPattern = /<a[^>]*>Download[^<]*<\/a>\s*<a[^>]*>Being Well App<\/a>/g;
    
    if (content.match(remainingDownloadPattern)) {
        content = content.replace(remainingDownloadPattern, '');
        hasChanges = true;
    }
    
    // Pattern 4: Remove any div containing download buttons
    const divDownloadPattern = /<div[^>]*>[\s\S]*?Download[\s\S]*?Being Well App[\s\S]*?<\/div>/gs;
    
    if (content.match(divDownloadPattern)) {
        content = content.replace(divDownloadPattern, '');
        hasChanges = true;
    }
    
    // Pattern 5: Remove any section with "Download" and "Being Well" in the same line
    const lineDownloadPattern = /Download[^<]*<\/a><a[^>]*>Being Well<\/a> App/g;
    
    if (content.match(lineDownloadPattern)) {
        content = content.replace(lineDownloadPattern, '');
        hasChanges = true;
    }
    
    return { content, hasChanges };
}

// Main function to process all HTML files
function removeAllRemainingDownloadSections() {
    const blogPostsDir = './blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    console.log(`🔍 Checking ${files.length} blog posts for ALL remaining download button sections...`);
    
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
removeAllRemainingDownloadSections(); 