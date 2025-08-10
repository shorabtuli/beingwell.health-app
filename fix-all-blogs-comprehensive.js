const fs = require('fs');
const path = require('path');

// Function to remove download button sections
function removeDownloadSections(content) {
    let hasChanges = false;
    
    // Pattern 1: Remove the CTA Section with download button - flexible match
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
    
    return { content, hasChanges };
}

// Function to capitalize the first letter of the first word in titles
function capitalizeTitles(content) {
    let hasChanges = false;
    
    // Pattern 1: Fix main h1 title
    const h1Pattern = /<h1[^>]*>\s*([a-z][^<]*)\s*-\s*Expert-Recommended Strategies<\/h1>/g;
    content = content.replace(h1Pattern, (match, title) => {
        const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);
        hasChanges = true;
        return `<h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">\n                    ${capitalizedTitle}\n                 - Expert-Recommended Strategies</h1>`;
    });
    
    // Pattern 2: Fix h2 titles
    const h2Pattern = /<h2[^>]*>\s*([a-z][^<]*)<\/h2>/g;
    content = content.replace(h2Pattern, (match, title) => {
        const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);
        hasChanges = true;
        return `<h2 class="text-3xl font-bold text-gray-900 mb-6">${capitalizedTitle}</h2>`;
    });
    
    return { content, hasChanges };
}

// Main function to process all HTML files
function fixAllBlogs() {
    const blogPostsDir = './blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    console.log(`🔍 Processing ${files.length} blog posts for comprehensive fixes...`);
    
    let totalFixed = 0;
    let downloadSectionsRemoved = 0;
    let titlesCapitalized = 0;
    
    files.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let fileChanged = false;
        
        console.log(`\n📄 Processing: ${file}`);
        
        // Remove download sections
        const { content: updatedContent, hasChanges: downloadChanges } = removeDownloadSections(content);
        content = updatedContent;
        if (downloadChanges) {
            downloadSectionsRemoved++;
            fileChanged = true;
        }
        
        // Capitalize titles
        const { content: finalContent, hasChanges: titleChanges } = capitalizeTitles(content);
        content = finalContent;
        if (titleChanges) {
            titlesCapitalized++;
            fileChanged = true;
        }
        
        if (fileChanged) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  ✅ Fixed issues in ${file}`);
            totalFixed++;
        } else {
            console.log(`  ✅ No issues found in ${file}`);
        }
    });
    
    console.log(`\n🎉 Comprehensive fix complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Processed ${files.length} blog posts`);
    console.log(`   - Fixed ${totalFixed} files`);
    console.log(`   - Removed download sections from ${downloadSectionsRemoved} files`);
    console.log(`   - Capitalized titles in ${titlesCapitalized} files`);
    console.log(`   - All blog posts should now be consistent!`);
}

// Run the comprehensive fix
fixAllBlogs(); 