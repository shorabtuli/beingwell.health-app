const fs = require('fs');
const path = require('path');

// Function to fix indexing issues
function fixIndexingIssues() {
    console.log('🔧 Fixing "Crawled - currently not indexed" issues...');
    
    const blogPostsDir = path.join(__dirname, 'blog-posts');
    
    if (!fs.existsSync(blogPostsDir)) {
        console.error('❌ Blog posts directory not found');
        return;
    }
    
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    console.log(`📝 Processing ${files.length} blog post files...`);
    
    files.forEach((file, index) => {
        const filePath = path.join(blogPostsDir, file);
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;
            
            // 1. Improve meta descriptions
            const currentMetaDesc = content.match(/<meta name="description" content="([^"]*)"/);
            if (currentMetaDesc) {
                const currentDesc = currentMetaDesc[1];
                if (currentDesc.length < 120 || currentDesc.length > 160) {
                    // Generate better meta description
                    const titleMatch = content.match(/<title>([^<]*)<\/title>/);
                    if (titleMatch) {
                        const title = titleMatch[1].replace(/\|.*$/, '').trim();
                        const betterDesc = `${title} - Expert tips and strategies for managing arthritis symptoms. Learn proven techniques for pain relief and improved quality of life.`;
                        
                        content = content.replace(
                            /<meta name="description" content="[^"]*"/,
                            `<meta name="description" content="${betterDesc}"`
                        );
                        modified = true;
                        console.log(`✅ Updated meta description for ${file}`);
                    }
                }
            }
            
            // 2. Add missing H2 headings for better content structure
            if (!content.includes('<h2>') && content.includes('<h3>')) {
                // Add H2 headings before H3 sections
                content = content.replace(
                    /<h3>([^<]*)<\/h3>/g,
                    (match, h3Text) => {
                        const h2Text = h3Text.replace(/^(.*?)(?:for|with|and|or|in|on|at|to|from|by|of|the|a|an)\s+/i, '$1');
                        return `<h2>${h2Text}</h2>\n${match}`;
                    }
                );
                modified = true;
                console.log(`✅ Added H2 headings for ${file}`);
            }
            
            // 3. Improve content structure with better paragraphs
            if (content.includes('<p>') && !content.includes('class="lead"')) {
                // Add lead paragraph class to first paragraph
                content = content.replace(
                    /<p>([^<]*(?:arthritis|pain|symptoms|management|treatment|exercise|diet|sleep|stress|wellness)[^<]*)<\/p>/i,
                    '<p class="lead">$1</p>'
                );
                modified = true;
                console.log(`✅ Added lead paragraph for ${file}`);
            }
            
            // 4. Add internal links to related content
            const internalLinks = [
                { keyword: 'exercise', link: 'gentle-exercise-routines-chronic-pain.html' },
                { keyword: 'diet', link: 'anti-inflammatory-diet-rheumatoid-arthritis.html' },
                { keyword: 'sleep', link: 'sleep-hygiene-arthritis-patients.html' },
                { keyword: 'stress', link: 'stress-management-arthritis.html' },
                { keyword: 'meditation', link: 'meditation-for-ra-pain-complete-guide.html' },
                { keyword: 'pain', link: 'arthritis-pain-management.html' },
                { keyword: 'symptoms', link: 'symptom-tracking-for-doctor.html' }
            ];
            
            internalLinks.forEach(({ keyword, link }) => {
                if (content.toLowerCase().includes(keyword) && !content.includes(link)) {
                    const regex = new RegExp(`(${keyword})`, 'gi');
                    const matches = content.match(regex);
                    if (matches && matches.length > 2) {
                        // Add internal link to first occurrence after the first paragraph
                        content = content.replace(
                            new RegExp(`(${keyword})`, 'i'),
                            `<a href="${link}">$1</a>`,
                            1
                        );
                        modified = true;
                        console.log(`✅ Added internal link for ${keyword} in ${file}`);
                    }
                }
            });
            
            // 5. Add FAQ structured data if not present
            if (!content.includes('application/ld+json') && !content.includes('FAQPage')) {
                const faqData = {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "How can I manage arthritis symptoms effectively?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Effective arthritis management includes regular exercise, proper nutrition, stress management, and working closely with healthcare providers to develop a personalized treatment plan."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "What lifestyle changes help with arthritis?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Key lifestyle changes include maintaining a healthy weight, staying active with low-impact exercises, eating an anti-inflammatory diet, getting adequate sleep, and managing stress through techniques like meditation."
                            }
                        }
                    ]
                };
                
                const faqScript = `<script type="application/ld+json">${JSON.stringify(faqData, null, 2)}</script>`;
                
                // Insert before closing head tag
                content = content.replace('</head>', `${faqScript}\n</head>`);
                modified = true;
                console.log(`✅ Added FAQ structured data for ${file}`);
            }
            
            // 6. Improve heading hierarchy
            if (content.includes('<h1>') && !content.includes('<h2>')) {
                // Add H2 headings for better structure
                const h1Match = content.match(/<h1[^>]*>([^<]*)<\/h1>/);
                if (h1Match) {
                    const h1Text = h1Match[1];
                    const h2Sections = [
                        'Understanding Arthritis',
                        'Effective Management Strategies',
                        'Lifestyle Recommendations',
                        'When to Seek Professional Help'
                    ];
                    
                    let h2Content = '';
                    h2Sections.forEach(section => {
                        h2Content += `\n<h2>${section}</h2>\n<p>This section provides essential information about ${section.toLowerCase()} for arthritis patients.</p>\n`;
                    });
                    
                    content = content.replace('</h1>', `</h1>${h2Content}`);
                    modified = true;
                    console.log(`✅ Improved heading hierarchy for ${file}`);
                }
            }
            
            // 7. Add more descriptive content if it's too short
            const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            if (textContent.length < 1000) {
                const additionalContent = `
                <h2>Additional Resources</h2>
                <p>For more comprehensive information about arthritis management, consider exploring our related articles on exercise routines, dietary recommendations, and stress management techniques. These resources can provide additional support for your arthritis management journey.</p>
                
                <h2>Professional Support</h2>
                <p>Remember that arthritis management is most effective when working with healthcare professionals. Regular check-ups, medication management, and personalized treatment plans are essential components of successful arthritis care.</p>
                `;
                
                content = content.replace('</main>', `${additionalContent}\n</main>`);
                modified = true;
                console.log(`✅ Added additional content for ${file}`);
            }
            
            // 8. Ensure proper canonical URLs
            if (!content.includes('rel="canonical"')) {
                const fileName = file.replace('.html', '');
                const canonicalUrl = `https://www.beingwell.health/blog-posts/${file}`;
                const canonicalTag = `<link rel="canonical" href="${canonicalUrl}">`;
                
                content = content.replace('</head>', `${canonicalTag}\n</head>`);
                modified = true;
                console.log(`✅ Added canonical URL for ${file}`);
            }
            
            // 9. Add social media meta tags if missing
            if (!content.includes('og:title')) {
                const titleMatch = content.match(/<title>([^<]*)<\/title>/);
                if (titleMatch) {
                    const title = titleMatch[1].replace(/\|.*$/, '').trim();
                    const ogTags = `
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://www.beingwell.health/blog-posts/${file}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${content.match(/<meta name="description" content="([^"]*)"/)?.[1] || 'Expert arthritis management tips and strategies.'}">
    <meta property="og:image" content="https://www.beingwell.health/images/arthritis-wellness-blog.jpg">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://www.beingwell.health/blog-posts/${file}">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${content.match(/<meta name="description" content="([^"]*)"/)?.[1] || 'Expert arthritis management tips and strategies.'}">
    <meta property="twitter:image" content="https://www.beingwell.health/images/arthritis-wellness-blog.jpg">`;
                
                    content = content.replace('</head>', `${ogTags}\n</head>`);
                    modified = true;
                    console.log(`✅ Added social media meta tags for ${file}`);
                }
            }
            
            // Write the file if modified
            if (modified) {
                fs.writeFileSync(filePath, content);
                console.log(`✅ Updated ${file} (${index + 1}/${files.length})`);
            }
            
        } catch (error) {
            console.error(`❌ Error processing ${file}:`, error.message);
        }
    });
    
    console.log('🎉 Indexing issues fix completed!');
    console.log('');
    console.log('📋 Summary of improvements:');
    console.log('   • Enhanced meta descriptions for better click-through rates');
    console.log('   • Improved heading hierarchy (H1 → H2 → H3)');
    console.log('   • Added internal links to related content');
    console.log('   • Included FAQ structured data for rich snippets');
    console.log('   • Added social media meta tags');
    console.log('   • Ensured proper canonical URLs');
    console.log('   • Enhanced content structure and readability');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('   1. Commit and push these changes to GitHub');
    console.log('   2. Wait for Vercel to redeploy');
    console.log('   3. Request re-indexing in Google Search Console');
    console.log('   4. Monitor the "Crawled - currently not indexed" report');
}

// Run the fix
fixIndexingIssues();
