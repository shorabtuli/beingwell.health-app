#!/usr/bin/env node

const fs = require('fs');

// The 4 orphan pages that need to be added to sitemap
const orphanPages = [
    'blog-posts/community-support-chronic-illness-diet-beginners.html',
    'blog-posts/comorbidity-management-ra-diabetes-heart-disease.html',
    'blog-posts/holistic-wellness-ra-tips-beginners.html',
    'blog-posts/surgery-preparation-recovery-ra-complete-guide.html'
];

function addOrphanPagesToSitemap() {
    console.log('📋 Adding orphan pages to sitemap...\n');
    
    try {
        // Read current sitemap
        const sitemapContent = fs.readFileSync('sitemap.xml', 'utf8');
        
        // Find the closing </urlset> tag
        const closingTagIndex = sitemapContent.lastIndexOf('</urlset>');
        
        if (closingTagIndex === -1) {
            throw new Error('Could not find closing </urlset> tag in sitemap');
        }
        
        // Create new URL entries
        const newEntries = orphanPages.map(page => {
            const urlPath = page.replace(/\\/g, '/');
            const currentDate = new Date().toISOString();
            
            return `  <url>
    <loc>https://www.beingwell.health/${urlPath}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
        }).join('\n');
        
        // Insert new entries before closing tag
        const updatedSitemap = sitemapContent.slice(0, closingTagIndex) + 
                              newEntries + '\n' + 
                              sitemapContent.slice(closingTagIndex);
        
        // Write updated sitemap
        fs.writeFileSync('sitemap.xml', updatedSitemap);
        
        console.log('✅ Successfully added 4 orphan pages to sitemap:');
        orphanPages.forEach(page => {
            console.log(`  - ${page}`);
        });
        
        console.log('\n📄 Updated sitemap.xml saved');
        
    } catch (error) {
        console.error('❌ Error updating sitemap:', error.message);
    }
}

addOrphanPagesToSitemap(); 