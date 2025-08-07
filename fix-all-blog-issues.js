const fs = require('fs');
const path = require('path');

// Function to fix all blog post issues
function fixAllBlogIssues() {
    const blogPostsDir = './blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    console.log(`Found ${files.length} blog posts to fix...`);
    
    files.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;
        
        console.log(`Processing: ${file}`);
        
        // 1. Fix broken footer links (HTML tags showing instead of rendered links)
        const footerLinkPattern = /<li><a href="\.\.\/blog\.html#([^"]+)" class="text-gray-600 hover:text-purple-600">([^<]+)<\/a><\/li>/g;
        const footerLinkReplacement = '<li><a href="../blog.html#$1" class="text-gray-600 hover:text-purple-600">$2</a></li>';
        
        if (content.match(footerLinkPattern)) {
            content = content.replace(footerLinkPattern, footerLinkReplacement);
            hasChanges = true;
            console.log(`  - Fixed footer links`);
        }
        
        // 2. Fix hero section layout issues
        const oldHeroPattern = /<section class="pt-20 pb-16 bg-gradient-to-br from-primary via-purple-600 to-secondary">/g;
        const newHeroSection = '<section class="pt-20 pb-16 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 min-h-screen flex items-center">';
        
        if (content.match(oldHeroPattern)) {
            content = content.replace(oldHeroPattern, newHeroSection);
            hasChanges = true;
            console.log(`  - Fixed hero section`);
        }
        
        // 3. Fix container div missing w-full class
        const containerPattern = /<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">/g;
        const containerReplacement = '<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">';
        
        if (content.match(containerPattern)) {
            content = content.replace(containerPattern, containerReplacement);
            hasChanges = true;
            console.log(`  - Fixed container div`);
        }
        
        // 4. Fix malformed main content sections
        const malformedMainPattern = /<main id="main-content"\$1>/g;
        const malformedMainReplacement = '<main id="main-content">';
        
        if (content.match(malformedMainPattern)) {
            content = content.replace(malformedMainPattern, malformedMainReplacement);
            hasChanges = true;
            console.log(`  - Fixed malformed main content`);
        }
        
        // 5. Fix broken image tags
        const brokenImagePattern = /<picture><source srcset=" src="([^"]+)" type="image\/webp"><img src="([^"]+)" alt="([^"]+)" class="([^"]+)" loading="lazy"><\/picture>/g;
        const fixedImageTag = '<picture>\n                        <source srcset="$1" type="image/webp">\n                        <img src="$2" \n                             alt="$3" \n                             class="$4" \n                             loading="lazy">\n                    </picture>';
        
        if (content.match(brokenImagePattern)) {
            content = content.replace(brokenImagePattern, fixedImageTag);
            hasChanges = true;
            console.log(`  - Fixed broken image tags`);
        }
        
        // 6. Fix malformed breadcrumb navigation
        const malformedBreadcrumbPattern = /<nav class="text-sm text-gray-500 mb-6" aria-label="Breadcrumb"><ol class="flex items-center space-x-2"><li><a href="\.\.\/index\.html" class="hover:text-purple-600" onclick="trackInternalNav\('\.\.\/index\.html'\)">Home<\/a><\/li><li><span class="mx-2">\/<\/span><\/li><li><a href="\.\.\/blog\.html" class="hover:text-purple-600" onclick="trackInternalNav\('\.\.\/blog\.html'\)">Blog<\/a><\/li><li><span class="mx-2">\/<\/span><\/li><li class="text-gray-900">([^<]+)<\/li><\/ol><\/nav>/g;
        const fixedBreadcrumb = '<nav class="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">\n            <ol class="flex items-center space-x-2">\n                <li><a href="../index.html" class="hover:text-purple-600" onclick="trackInternalNav(\'../index.html\')">Home</a></li>\n                <li><span class="mx-2">/</span></li>\n                <li><a href="../blog.html" class="hover:text-purple-600" onclick="trackInternalNav(\'../blog.html\')">Blog</a></li>\n                <li><span class="mx-2">/</span></li>\n                <li class="text-gray-900">$1</li>\n            </ol>\n        </nav>';
        
        if (content.match(malformedBreadcrumbPattern)) {
            content = content.replace(malformedBreadcrumbPattern, fixedBreadcrumb);
            hasChanges = true;
            console.log(`  - Fixed malformed breadcrumb`);
        }
        
        // 7. Add explicit background to hero sections for guaranteed rendering
        const heroSectionPattern = /<section class="pt-20 pb-16 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 min-h-screen flex items-center">/g;
        const heroSectionWithStyle = '<section class="pt-20 pb-16 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 min-h-screen flex items-center" style="background: linear-gradient(to bottom right, #9333ea, #7c3aed, #6b21a8);">';
        
        if (content.match(heroSectionPattern)) {
            content = content.replace(heroSectionPattern, heroSectionWithStyle);
            hasChanges = true;
            console.log(`  - Added explicit background to hero section`);
        }
        
        // 8. Fix any remaining escaped HTML entities in links
        const escapedAmpPattern = /&amp;/g;
        if (content.match(escapedAmpPattern)) {
            content = content.replace(escapedAmpPattern, '&');
            hasChanges = true;
            console.log(`  - Fixed escaped HTML entities`);
        }
        
        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  ✅ Fixed issues in ${file}`);
        } else {
            console.log(`  ✅ No issues found in ${file}`);
        }
    });
    
    console.log('\n🎉 All blog post issues have been fixed!');
}

// Run the fix
fixAllBlogIssues(); 