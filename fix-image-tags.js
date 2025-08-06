const fs = require('fs');
const path = require('path');

// Function to fix broken image tags
function fixImageTags(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix broken picture and img tags
    content = content.replace(
        /<picture><source srcset=" src=" https:="" images\.unsplash\.com="[^"]*" type="image\/webp"><img src="([^"]*)" alt="([^"]*)" class="([^"]*)" loading="lazy"><\/picture>/g,
        '<picture><source srcset="$1" type="image/webp"><img src="$1" alt="$2" class="$3" loading="lazy"></picture>'
    );
    
    // Fix broken img tags without picture wrapper
    content = content.replace(
        /<img src="([^"]*)" alt="([^"]*)" class="([^"]*)" loading="lazy">/g,
        '<img src="$1" alt="$2" class="$3" loading="lazy">'
    );
    
    // Fix malformed URLs with escaped characters
    content = content.replace(
        /https:="" images\.unsplash\.com="([^"]*)"/g,
        'https://images.unsplash.com/$1'
    );
    
    // Fix broken alt attributes
    content = content.replace(
        /alt="([^"]*)" class="([^"]*)" loading="lazy">/g,
        'alt="$1" class="$2" loading="lazy">'
    );
    
    return content;
}

// Process all blog posts
const blogPostsDir = 'blog-posts';
const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));

console.log(`Fixing image tags in ${files.length} blog posts...`);

files.forEach(file => {
    const filePath = path.join(blogPostsDir, file);
    const fixedContent = fixImageTags(filePath);
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log(`Fixed: ${file}`);
});

console.log('Image tag fixes completed!'); 