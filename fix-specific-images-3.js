const fs = require('fs');

// Fix specific malformed image tags
function fixSpecificImages3() {
    const files = [
        {
            path: 'blog-posts/hand-arthritis-exercises-for-pain-relief.html',
            broken: `<picture><source srcset=" src=" https://images.unsplash.com/ photo-1571019613454-1cb2f99b2d8b?ixlib="rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp&quot;" type="image/webp"><img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp 
                     alt=" hand="" arthritis="" exercises="" for="" pain="" relief="" rheumatoid="" patients"="" class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg" loading="lazy"></picture>`,
            fixed: `<picture>
                <source srcset="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp" type="image/webp">
                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp" 
                     alt="Hand arthritis exercises for pain relief rheumatoid patients" 
                     class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg" 
                     loading="lazy">
            </picture>`
        },
        {
            path: 'blog-posts/chair-exercises-for-arthritis-patients.html',
            broken: `<picture><source srcset=" src=" https://images.unsplash.com/ photo-1571019613454-1cb2f99b2d8b?ixlib="rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp&quot;" type="image/webp"><img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp 
                     alt=" chair="" exercises="" for="" arthritis="" patients="" rheumatoid="" patients"="" class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg" loading="lazy"></picture>`,
            fixed: `<picture>
                <source srcset="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp" type="image/webp">
                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp" 
                     alt="Chair exercises for arthritis patients rheumatoid patients" 
                     class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg" 
                     loading="lazy">
            </picture>`
        }
    ];
    
    files.forEach(file => {
        let content = fs.readFileSync(file.path, 'utf8');
        
        if (content.includes(file.broken)) {
            content = content.replace(file.broken, file.fixed);
            fs.writeFileSync(file.path, content, 'utf8');
            console.log(`Fixed image tag in ${file.path}`);
        } else {
            console.log(`No broken image tag found in ${file.path}`);
        }
    });
    
    console.log('\nFixed specific image tags.');
}

fixSpecificImages3(); 