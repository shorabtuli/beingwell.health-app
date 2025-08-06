const fs = require('fs');
const path = require('path');

// Function to fix broken HTML structure
function fixHtmlStructure(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix broken title tags
    content = content.replace(
        /<title>([^<]*?)&lt;a[^>]*?&gt;([^<]*?)&lt;\/a&gt;([^<]*?)<\/title>/g,
        '<title>$1$2$3</title>'
    );
    
    // Fix broken canonical URLs
    content = content.replace(
        /<link rel="canonical" href="([^"]*?)"[^>]*?&gt;([^<]*?)&lt;\/a&gt;([^<]*?)&gt;/g,
        '<link rel="canonical" href="$1">'
    );
    
    // Fix broken schema markup
    content = content.replace(
        /<script type="application\/ld\+json">([^<]*?)&gt;/g,
        '<script type="application/ld+json">$1</script>'
    );
    
    // Fix broken body tags
    content = content.replace(
        /<body>([^<]*?)&lt;a[^>]*?&gt;([^<]*?)&lt;\/a&gt;([^<]*?)<\/body>/g,
        '<body>$1$2$3</body>'
    );
    
    return content;
}

// Process all blog posts
const blogPostsDir = 'blog-posts';
const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));

console.log(`Fixing HTML structure in ${files.length} blog posts...`);

files.forEach(file => {
    const filePath = path.join(blogPostsDir, file);
    const fixedContent = fixHtmlStructure(filePath);
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log(`Fixed: ${file}`);
});

console.log('HTML structure fixes completed!'); 