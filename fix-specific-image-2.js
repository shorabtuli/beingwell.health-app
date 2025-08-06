const fs = require('fs');

// Fix the specific malformed image tag
function fixSpecificImage2() {
    const filePath = 'blog-posts/how-to-reduce-morning-stiffness-rheumatoid-arthritis.html';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the broken image tag with a proper one
    const brokenImageTag = `<picture><source srcset=" src=" https://images.unsplash.com/ photo-1571019613454-1cb2f99b2d8b?ixlib="rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp&quot;" type="image/webp"><img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp 
                     alt=" how="" to="" reduce="" morning="" stiffness="" rheumatoid="" arthritis="" for="" patients"="" class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg" loading="lazy"></picture>`;
    
    const fixedImageTag = `<picture>
                <source srcset="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp" type="image/webp">
                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp" 
                     alt="How to reduce morning stiffness rheumatoid arthritis for patients" 
                     class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg" 
                     loading="lazy">
            </picture>`;
    
    content = content.replace(brokenImageTag, fixedImageTag);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed specific image tag in how-to-reduce-morning-stiffness-rheumatoid-arthritis.html');
}

fixSpecificImage2(); 