const fs = require('fs');
const path = require('path');

// Function to fix malformed script tags
function fixScriptTags(content) {
    let hasChanges = false;
    
    // Fix the malformed script tag pattern
    const malformedScriptPattern = /<\/script>>/g;
    
    if (content.match(malformedScriptPattern)) {
        content = content.replace(malformedScriptPattern, '</script>');
        hasChanges = true;
    }
    
    return { content, hasChanges };
}

// Main function to process all HTML files
function fixAllScriptTags() {
    const blogPostsDir = './blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    console.log(`🔍 Checking ${files.length} blog posts for malformed script tags...`);
    
    let totalFixed = 0;
    let totalChecked = 0;
    
    files.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        totalChecked++;
        
        const { content: updatedContent, hasChanges } = fixScriptTags(content);
        content = updatedContent;
        
        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  ✅ Fixed script tags in ${file}`);
            totalFixed++;
        }
    });
    
    console.log(`\n🎉 Script tag fix complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Checked ${totalChecked} blog posts`);
    console.log(`   - Fixed script tags in ${totalFixed} files`);
    console.log(`   - All malformed script tags have been corrected!`);
}

// Run the fix
fixAllScriptTags(); 