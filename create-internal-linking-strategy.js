#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to create internal linking strategy
function createInternalLinkingStrategy() {
    const blogPostsDir = './blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    console.log(`🔗 Creating internal linking strategy for ${files.length} blog posts...`);
    
    // Group files by category
    const categories = {
        'exercise': files.filter(f => f.includes('exercise') || f.includes('workout') || f.includes('fitness')),
        'nutrition': files.filter(f => f.includes('diet') || f.includes('nutrition') || f.includes('food') || f.includes('meal')),
        'sleep': files.filter(f => f.includes('sleep') || f.includes('bed') || f.includes('rest')),
        'mental-health': files.filter(f => f.includes('mental') || f.includes('stress') || f.includes('meditation') || f.includes('anxiety')),
        'pain-management': files.filter(f => f.includes('pain') || f.includes('relief') || f.includes('therapy')),
        'lifestyle': files.filter(f => f.includes('lifestyle') || f.includes('daily') || f.includes('routine')),
        'apps': files.filter(f => f.includes('app') || f.includes('tracker') || f.includes('technology'))
    };
    
    console.log('\n📊 Blog Post Categories:');
    Object.entries(categories).forEach(([category, files]) => {
        console.log(`   ${category}: ${files.length} posts`);
    });
    
    // Create linking recommendations
    console.log('\n🔗 Internal Linking Recommendations:');
    console.log('1. Add 3-5 related internal links to each blog post');
    console.log('2. Link from newer posts to older posts');
    console.log('3. Use descriptive anchor text');
    console.log('4. Link to your main pages (homepage, blog)');
    
    // Generate sample internal links for a few posts
    console.log('\n📝 Sample Internal Links to Add:');
    
    const samplePosts = files.slice(0, 5);
    samplePosts.forEach(post => {
        const postName = post.replace('.html', '');
        console.log(`\n${postName}:`);
        
        // Find related posts
        const relatedPosts = files.filter(f => {
            const fName = f.replace('.html', '');
            return fName !== postName && (
                fName.includes(postName.split('-')[0]) ||
                fName.includes(postName.split('-')[1]) ||
                fName.includes(postName.split('-')[2])
            );
        }).slice(0, 3);
        
        relatedPosts.forEach(related => {
            const relatedName = related.replace('.html', '');
            const anchorText = relatedName.split('-').slice(0, 3).join(' ');
            console.log(`   - <a href="${related}">${anchorText}</a>`);
        });
        
        // Add main page links
        console.log(`   - <a href="../index.html">Being Well App</a>`);
        console.log(`   - <a href="../blog.html">More RA Resources</a>`);
    });
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Add internal links to your blog posts');
    console.log('2. Submit sitemap to Google Search Console');
    console.log('3. Request indexing for key pages');
    console.log('4. Wait 2-4 weeks for Google to process all pages');
    console.log('5. Monitor indexing progress in Google Search Console');
}

// Run the strategy
createInternalLinkingStrategy(); 