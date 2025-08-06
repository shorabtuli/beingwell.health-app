const fs = require('fs');
const path = require('path');

function fixNavigationLinks() {
    const blogPostsDir = 'blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    let fixedCount = 0;
    
    files.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;
        
        // Fix the malformed Blog link in navigation
        const brokenBlogLink = /<a href="index\.html#<a href=" \.\.="" blog\.html"="" class="text-purple-600 hover:text-purple-800 underline" onclick="trackInternalNav\('\.\.\/blog\.html'\)">blog<\/a>" class="text-primary px-3 py-2 rounded-md text-sm font-medium"&gt;<a href="\.\.\/blog\.html" class="text-purple-600 hover:text-purple-800 underline" onclick="trackInternalNav\('\.\.\/blog\.html'\)">Blog<\/a>/g;
        const fixedBlogLink = '<a href="../blog.html" class="text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">Blog</a>';
        
        if (brokenBlogLink.test(content)) {
            content = content.replace(brokenBlogLink, fixedBlogLink);
            hasChanges = true;
        }
        
        // Fix the malformed "Back to Blog" link
        const brokenBackLink = /<a href="index\.html#<a href=" \.\.="" blog\.html"="" class="text-purple-600 hover:text-purple-800 underline" onclick="trackInternalNav\('\.\.\/blog\.html'\)">blog<\/a>" class="text-primary hover:underline"&gt;← Back to <a href="\.\.\/blog\.html" class="text-purple-600 hover:text-purple-800 underline" onclick="trackInternalNav\('\.\.\/blog\.html'\)">Blog<\/a>/g;
        const fixedBackLink = '<a href="../blog.html" class="text-primary hover:underline">← Back to Blog</a>';
        
        if (brokenBackLink.test(content)) {
            content = content.replace(brokenBackLink, fixedBackLink);
            hasChanges = true;
        }
        
        // Fix any remaining malformed links with escaped characters
        const escapedLinkPattern = /&lt;a href="([^"]+)" class="([^"]+)"&gt;([^&]+)&lt;\/a&gt;/g;
        if (escapedLinkPattern.test(content)) {
            content = content.replace(escapedLinkPattern, '<a href="$1" class="$2">$3</a>');
            hasChanges = true;
        }
        
        // Fix any remaining malformed closing tags
        const brokenClosingTag = /&gt;<\/a>/g;
        if (brokenClosingTag.test(content)) {
            content = content.replace(brokenClosingTag, '</a>');
            hasChanges = true;
        }
        
        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            fixedCount++;
            console.log(`Fixed navigation links in ${file}`);
        }
    });
    
    console.log(`\nFixed navigation links in ${fixedCount} files.`);
}

fixNavigationLinks(); 