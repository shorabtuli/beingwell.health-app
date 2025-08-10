const fs = require('fs');
const path = require('path');

// List of files that still have download button sections
const remainingFiles = [
    'meditation-for-ra-pain-complete-guide.html',
    'comorbidity-management-ra-diabetes-heart-disease.html',
    'community-support-chronic-illness-diet-beginners.html',
    'sleep-exercises-ra-complete-guide.html',
    'journaling-ra-mental-health-complete-guide.html',
    'exercise-nutrition-ra-complete-guide.html',
    'holistic-wellness-ra-tips-beginners.html',
    'arthritis-success-stories.html',
    'hydration-for-ra-inflammation-beginner-guide.html',
    'surgery-preparation-recovery-ra-complete-guide.html'
];

// Function to remove download button sections
function removeDownloadSections(content) {
    let hasChanges = false;
    
    // Pattern 1: Remove purple gradient download sections
    const purpleDownloadPattern = /<div class="text-center bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-8 text-white mb-8">\s*<h3[^>]*>Ready to[^<]*<\/h3>\s*<p[^>]*>[^<]*<\/p>\s*<a[^>]*>Download Being Well App<\/a>\s*<\/div>/gs;
    
    if (content.match(purpleDownloadPattern)) {
        content = content.replace(purpleDownloadPattern, '');
        hasChanges = true;
    }
    
    // Pattern 2: Remove other download sections
    const downloadPattern = /<div[^>]*class="[^"]*bg-gradient[^"]*"[^>]*>\s*<h3[^>]*>Ready to[^<]*<\/h3>\s*<p[^>]*>[^<]*<\/p>\s*<a[^>]*>Download Being Well App<\/a>\s*<\/div>/gs;
    
    if (content.match(downloadPattern)) {
        content = content.replace(downloadPattern, '');
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