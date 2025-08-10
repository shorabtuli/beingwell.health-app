const fs = require('fs');
const path = require('path');

// Function to capitalize the first letter of the first word in a title
function capitalizeFirstWord(title) {
    // Split by hyphens and capitalize the first word
    const words = title.split('-');
    if (words.length > 0) {
        const firstWord = words[0];
        const capitalizedFirstWord = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
        words[0] = capitalizedFirstWord;
        return words.join('-');
    }
    return title;
}

// Function to fix titles in HTML content
function fixTitles(content) {
    let hasChanges = false;
    
    // Pattern 1: Fix main h1 title
    const h1Pattern = /<h1[^>]*>([^<]+) - Expert-Recommended Strategies<\/h1>/g;
    content = content.replace(h1Pattern, (match, title) => {
        const capitalizedTitle = capitalizeFirstWord(title);
        hasChanges = true;
        return `<h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">${capitalizedTitle} - Expert-Recommended Strategies</h1>`;
    });
    
    // Pattern 2: Fix h2 titles that might have the same issue
    const h2Pattern = /<h2[^>]*>([^<]+) - Expert-Recommended Strategies<\/h2>/g;
    content = content.replace(h2Pattern, (match, title) => {
        const capitalizedTitle = capitalizeFirstWord(title);
        hasChanges = true;
        return `<h2 class="text-3xl font-bold text-gray-900 mb-6">${capitalizedTitle} - Expert-Recommended Strategies</h2>`;
    });
    
    // Pattern 3: Fix malformed h2 titles (those with attributes in the tag)
    const malformedH2Pattern = /<h2([^>]*>)([^<]+) - Expert-Recommended Strategies<\/h2>/g;
    content = content.replace(malformedH2Pattern, (match, attributes, title) => {
        const capitalizedTitle = capitalizeFirstWord(title);
        hasChanges = true;
        return `<h2 class="text-3xl font-bold text-gray-900 mb-6">${capitalizedTitle} - Expert-Recommended Strategies</h2>`;
    });
    
    return { content, hasChanges };
}

// Main function to process all HTML files
function capitalizeAllTitles() {
    const blogPostsDir = './blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    console.log(`🔍 Checking ${files.length} blog posts for title capitalization...`);
    
    let totalFixed = 0;
    let totalChecked = 0;
    
    files.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        console.log(`\n📄 Processing: ${file}`);
        totalChecked++;
        
        // Fix titles
        const { content: updatedContent, hasChanges } = fixTitles(content);
        content = updatedContent;
        
        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  ✅ Fixed title capitalization in ${file}`);
            totalFixed++;
        } else {
            console.log(`  ✅ No title changes needed in ${file}`);
        }
    });
    
    console.log(`\n🎉 Title capitalization update complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Checked ${totalChecked} blog posts`);
    console.log(`   - Fixed titles in ${totalFixed} files`);
    console.log(`   - All blog post titles now have proper capitalization!`);
}

// Run the capitalization
capitalizeAllTitles(); 