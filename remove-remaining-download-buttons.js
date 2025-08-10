const fs = require('fs');
const path = require('path');

// List of files that still have download button sections
const remainingFiles = [
    'sleep-exercises-ra-complete-guide.html',
    'exercise-nutrition-ra-complete-guide.html',
    'hydration-for-ra-inflammation-beginner-guide.html',
    'surgery-preparation-recovery-ra-complete-guide.html'
];

// Function to remove download button sections
function removeDownloadSections(content) {
    let hasChanges = false;
    
    // Pattern: Remove the flex container with download button
    const downloadSectionPattern = /<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">\s*<a[^>]*>Download Being Well App<\/a>\s*<a[^>]*>Explore More RA Resources<\/a>\s*<\/div>/gs;
    
    if (content.match(downloadSectionPattern)) {
        content = content.replace(downloadSectionPattern, '');
        hasChanges = true;
    }
    
    return { content, hasChanges };
}

// Main function to process the remaining files
function removeRemainingDownloadSections() {
    console.log(`🔍 Processing ${remainingFiles.length} remaining files with download button sections...`);
    
    let totalFixed = 0;
    
    remainingFiles.forEach(file => {
        const filePath = path.join('./blog-posts', file);
        
        if (fs.existsSync(filePath)) {
            console.log(`\n📄 Processing: ${file}`);
            
            let content = fs.readFileSync(filePath, 'utf8');
            
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
        } else {
            console.log(`  ❌ File not found: ${file}`);
        }
    });
    
    console.log(`\n🎉 Remaining download button section removal complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Processed ${remainingFiles.length} remaining files`);
    console.log(`   - Removed download sections from ${totalFixed} files`);
    console.log(`   - All download button sections should now be removed!`);
}

// Run the removal
removeRemainingDownloadSections(); 