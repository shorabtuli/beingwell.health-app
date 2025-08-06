const fs = require('fs');
const path = require('path');

function fixNavigationPaths() {
    const blogPostsDir = 'blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    let fixedCount = 0;
    
    files.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;
        
        // Fix navigation links to point to parent directory
        const patterns = [
            // Fix Features link
            {
                from: /href="index\.html#features"/g,
                to: 'href="../index.html#features"'
            },
            // Fix Testimonials link
            {
                from: /href="index\.html#testimonials"/g,
                to: 'href="../index.html#testimonials"'
            },
            // Fix FAQ link
            {
                from: /href="index\.html#faq"/g,
                to: 'href="../index.html#faq"'
            },
            // Fix any other index.html references
            {
                from: /href="index\.html#([^"]+)"/g,
                to: 'href="../index.html#$1"'
            }
        ];
        
        patterns.forEach(pattern => {
            if (pattern.from.test(content)) {
                content = content.replace(pattern.from, pattern.to);
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            fixedCount++;
            console.log(`Fixed navigation paths in ${file}`);
        }
    });
    
    console.log(`\nFixed navigation paths in ${fixedCount} files.`);
}

fixNavigationPaths(); 