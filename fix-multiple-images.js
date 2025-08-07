const fs = require('fs');

// Fix multiple malformed image tags
function fixMultipleImages() {
    const files = [
        'blog-posts/hand-arthritis-exercises-for-pain-relief.html',
        'blog-posts/chair-exercises-for-arthritis-patients.html'
    ];
    
    files.forEach(filePath => {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace the broken image tag with a proper one
        const brokenImageTag = /<picture><source srcset=" src=" https:\/\/images\.unsplash\.com\/ photo-1571019613454-1cb2f99b2d8b\?ixlib="rb-4\.0\.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp&quot;" type="image\/webp"><img src="https:\/\/images\.unsplash\.com\/photo-1571019613454-1cb2f99b2d8b\?ixlib=rb-4\.0\.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp [^>]*alt="[^"]*" class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg" loading="lazy"><\/picture>/g;
        
        const fixedImageTag = `<picture>
                <source srcset="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp" type="image/webp">
                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp" 
                     alt="Exercise and movement for rheumatoid patients" 
                     class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg" 
                     loading="lazy">
            </picture>`;
        
        if (brokenImageTag.test(content)) {
            content = content.replace(brokenImageTag, fixedImageTag);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed image tag in ${filePath}`);
        } else {
            console.log(`No broken image tag found in ${filePath}`);
        }
    });
    
    console.log('\nFixed multiple image tags.');
}

fixMultipleImages(); 