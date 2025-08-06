const fs = require('fs');
const path = require('path');

// Function to improve content quality
function improveContentQuality(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath, '.html');
    
    // Generate better title
    const betterTitle = fileName
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/\bRa\b/g, 'RA')
        .replace(/\bArthritis\b/g, 'Arthritis');
    
    // Generate better meta description
    const betterDescription = `Learn proven strategies for ${fileName.replace(/-/g, ' ')} to manage rheumatoid arthritis symptoms. Expert tips, practical advice, and personalized approaches for better RA wellness from Being Well.`;
    
    // Replace title
    content = content.replace(
        /<title>[^<]*?<\/title>/g,
        `<title>${betterTitle} - RA Management Guide | Being Well</title>`
    );
    
    // Replace meta description
    content = content.replace(
        /<meta name="description" content="[^"]*?"/g,
        `<meta name="description" content="${betterDescription}"`
    );
    
    // Add better schema markup
    const schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": `${betterTitle} - RA Management Guide`,
        "description": betterDescription,
        "author": {
            "@type": "Organization",
            "name": "Being Well Team"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Being Well",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.beingwell.health/logo.png"
            }
        },
        "datePublished": "2024-01-15T00:00:00Z",
        "dateModified": "2024-01-15T00:00:00Z",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.beingwell.health/blog-posts/${fileName}.html`
        },
        "articleSection": "RA Wellness",
        "keywords": `${fileName.replace(/-/g, ', ')}, arthritis management, RA wellness, chronic pain relief, rheumatoid arthritis`
    };
    
    // Replace schema markup
    content = content.replace(
        /<script type="application\/ld\+json">[^<]*?<\/script>/g,
        `<script type="application/ld+json">${JSON.stringify(schemaMarkup, null, 2)}</script>`
    );
    
    return content;
}

// Process all blog posts
const blogPostsDir = 'blog-posts';
const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));

console.log(`Improving content quality in ${files.length} blog posts...`);

files.forEach(file => {
    const filePath = path.join(blogPostsDir, file);
    const improvedContent = improveContentQuality(filePath);
    fs.writeFileSync(filePath, improvedContent, 'utf8');
    console.log(`Improved: ${file}`);
});

console.log('Content quality improvements completed!'); 