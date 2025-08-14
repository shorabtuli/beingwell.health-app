#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to add robots meta tag to HTML files
function addRobotsMetaTag(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check if robots meta tag already exists
        if (content.includes('meta name="robots"')) {
            return false; // Already has robots meta tag
        }
        
        // Find the position after the keywords meta tag
        const keywordsIndex = content.indexOf('<meta name="keywords"');
        if (keywordsIndex === -1) {
            console.log(`⚠️  No keywords meta tag found in ${filePath}`);
            return false;
        }
        
        // Find the end of the keywords meta tag
        const keywordsEndIndex = content.indexOf('>', keywordsIndex) + 1;
        
        // Insert robots meta tag after keywords
        const robotsMetaTag = '\n    <meta name="robots" content="index, follow">\n    ';
        const newContent = content.slice(0, keywordsEndIndex) + robotsMetaTag + content.slice(keywordsEndIndex);
        
        // Write the updated content back to the file
        fs.writeFileSync(filePath, newContent);
        return true;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Main function
function main() {
    console.log('🤖 Adding robots meta tag to blog files...\n');
    
    const blogPostsDir = './blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    files.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        const wasUpdated = addRobotsMetaTag(filePath);
        
        if (wasUpdated) {
            updatedCount++;
            console.log(`✅ Updated: ${file}`);
        } else {
            skippedCount++;
        }
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`   - Files updated: ${updatedCount}`);
    console.log(`   - Files skipped (already had robots tag): ${skippedCount}`);
    console.log(`   - Total files processed: ${files.length}`);
    
    if (updatedCount > 0) {
        console.log(`\n🎉 Successfully added robots meta tag to ${updatedCount} files!`);
        console.log('🔍 Google Console should now be able to find and index these pages properly.');
    } else {
        console.log('\nℹ️  All files already have the robots meta tag.');
    }
}

// Run the script
main(); 