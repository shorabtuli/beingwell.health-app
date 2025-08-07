const fs = require('fs');
const path = require('path');

// Function to check and fix broken images in all blog posts
function checkAndFixBrokenImages() {
    const blogPostsDir = './blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    console.log(`Checking ${files.length} blog posts for broken images...`);
    
    let totalFixed = 0;
    
    files.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;
        
        console.log(`\nChecking: ${file}`);
        
        // 1. Check for malformed picture tags with broken srcset
        const brokenPicturePattern1 = /<picture><source srcset=" src="([^"]+)" type="image\/webp"><img src="([^"]+)" alt="([^"]+)" class="([^"]+)" loading="lazy"><\/picture>/g;
        const fixedPictureTag1 = '<picture>\n                    <source srcset="$1" type="image/webp">\n                    <img src="$2" \n                         alt="$3" \n                         class="$4" \n                         loading="lazy">\n                </picture>';
        
        if (content.match(brokenPicturePattern1)) {
            content = content.replace(brokenPicturePattern1, fixedPictureTag1);
            hasChanges = true;
            console.log(`  ✅ Fixed malformed picture tag (pattern 1)`);
        }
        
        // 2. Check for picture tags with escaped quotes in srcset
        const brokenPicturePattern2 = /<picture><source srcset="([^"]+)" type="image\/webp"><img src="([^"]+)" alt="([^"]+)" class="([^"]+)" loading="lazy"><\/picture>/g;
        const fixedPictureTag2 = '<picture>\n                    <source srcset="$1" type="image/webp">\n                    <img src="$2" \n                         alt="$3" \n                         class="$4" \n                         loading="lazy">\n                </picture>';
        
        if (content.match(brokenPicturePattern2)) {
            content = content.replace(brokenPicturePattern2, fixedPictureTag2);
            hasChanges = true;
            console.log(`  ✅ Fixed malformed picture tag (pattern 2)`);
        }
        
        // 3. Check for broken image URLs with escaped entities
        const brokenUrlPattern = /https:\/\/images\.unsplash\.com\/ photo-([^"]+)/g;
        const fixedUrlPattern = 'https://images.unsplash.com/photo-$1';
        
        if (content.match(brokenUrlPattern)) {
            content = content.replace(brokenUrlPattern, fixedUrlPattern);
            hasChanges = true;
            console.log(`  ✅ Fixed broken image URLs`);
        }
        
        // 4. Check for malformed alt attributes with escaped quotes
        const brokenAltPattern = /alt="([^"]*&quot;[^"]*)"([^>]*>)/g;
        const fixedAltPattern = 'alt="$1"$2';
        
        if (content.match(brokenAltPattern)) {
            content = content.replace(brokenAltPattern, fixedAltPattern);
            hasChanges = true;
            console.log(`  ✅ Fixed malformed alt attributes`);
        }
        
        // 5. Check for missing featured image sections
        const hasFeaturedImage = content.includes('<!-- Featured Image -->');
        const hasPictureTag = content.includes('<picture>');
        
        if (hasFeaturedImage && !hasPictureTag) {
            // Add a standard featured image if missing
            const featuredImageSection = `
                <!-- Featured Image -->
                <div class="mb-12">
                    <picture>
                        <source srcset="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp" type="image/webp">
                        <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp" 
                             alt="Featured image for ${file.replace('.html', '').replace(/-/g, ' ')}" 
                             class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg" 
                             loading="lazy">
                    </picture>
                </div>`;
            
            // Insert after the article content div
            const articleContentPattern = /<div class="prose prose-lg max-w-none">/;
            if (content.match(articleContentPattern)) {
                content = content.replace(articleContentPattern, featuredImageSection + '\n                <div class="prose prose-lg max-w-none">');
                hasChanges = true;
                console.log(`  ✅ Added missing featured image`);
            }
        }
        
        // 6. Check for malformed headings that might affect layout
        const malformedHeadingPattern = /<h2([^>]*>)([^<]*\$[0-9]+)/g;
        const fixedHeadingPattern = '<h2$1$2';
        
        if (content.match(malformedHeadingPattern)) {
            content = content.replace(malformedHeadingPattern, fixedHeadingPattern);
            hasChanges = true;
            console.log(`  ✅ Fixed malformed headings`);
        }
        
        // 7. Check for any remaining escaped HTML entities in image contexts
        const escapedEntitiesPattern = /&quot;/g;
        if (content.match(escapedEntitiesPattern)) {
            content = content.replace(escapedEntitiesPattern, '"');
            hasChanges = true;
            console.log(`  ✅ Fixed escaped HTML entities`);
        }
        
        // 8. Check for broken image tags with missing attributes
        const brokenImgPattern = /<img([^>]*src="[^"]*")([^>]*>)/g;
        const fixedImgPattern = '<img$1 alt="Featured image" class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg" loading="lazy"$2';
        
        if (content.match(brokenImgPattern)) {
            content = content.replace(brokenImgPattern, fixedImgPattern);
            hasChanges = true;
            console.log(`  ✅ Fixed broken img tags`);
        }
        
        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  ✅ Fixed issues in ${file}`);
            totalFixed++;
        } else {
            console.log(`  ✅ No broken images found in ${file}`);
        }
    });
    
    console.log(`\n🎉 Image check complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Checked ${files.length} blog posts`);
    console.log(`   - Fixed issues in ${totalFixed} files`);
    console.log(`   - All broken images should now be resolved!`);
}

// Run the check and fix
checkAndFixBrokenImages(); 