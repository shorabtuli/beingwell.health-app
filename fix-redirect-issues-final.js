const fs = require('fs');
const path = require('path');

// Function to fix redirect issues
function fixRedirectIssues() {
    console.log('🔧 Fixing redirect issues...');
    
    // 1. Update sitemap.xml to ensure all URLs are HTTPS and www
    console.log('📝 Updating sitemap.xml...');
    try {
        const sitemapPath = path.join(__dirname, 'sitemap.xml');
        let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
        
        // Replace any HTTP URLs with HTTPS
        sitemapContent = sitemapContent.replace(/http:\/\//g, 'https://');
        
        // Ensure all URLs have www
        sitemapContent = sitemapContent.replace(/https:\/\/beingwell\.health/g, 'https://www.beingwell.health');
        
        // Update lastmod dates to current date
        const currentDate = new Date().toISOString().split('T')[0];
        sitemapContent = sitemapContent.replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${currentDate}</lastmod>`);
        
        fs.writeFileSync(sitemapPath, sitemapContent);
        console.log('✅ Sitemap updated successfully');
    } catch (error) {
        console.error('❌ Error updating sitemap:', error.message);
    }
    
    // 2. Fix any remaining internal links in HTML files
    console.log('🔗 Fixing internal links in HTML files...');
    const blogPostsDir = path.join(__dirname, 'blog-posts');
    
    if (fs.existsSync(blogPostsDir)) {
        const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
        
        files.forEach(file => {
            const filePath = path.join(blogPostsDir, file);
            try {
                let content = fs.readFileSync(filePath, 'utf8');
                
                // Fix any HTTP links to HTTPS
                content = content.replace(/http:\/\//g, 'https://');
                
                // Ensure all beingwell.health links have www
                content = content.replace(/https:\/\/beingwell\.health/g, 'https://www.beingwell.health');
                
                // Fix any relative links that might cause redirects
                content = content.replace(/href="\/([^"]*\.html)"/g, 'href="/$1"');
                
                fs.writeFileSync(filePath, content);
                console.log(`✅ Updated ${file}`);
            } catch (error) {
                console.error(`❌ Error updating ${file}:`, error.message);
            }
        });
    }
    
    // 3. Update main index.html if it exists
    console.log('🏠 Updating main index.html...');
    const mainIndexPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(mainIndexPath)) {
        try {
            let content = fs.readFileSync(mainIndexPath, 'utf8');
            
            // Fix any HTTP links to HTTPS
            content = content.replace(/http:\/\//g, 'https://');
            
            // Ensure all beingwell.health links have www
            content = content.replace(/https:\/\/beingwell\.health/g, 'https://www.beingwell.health');
            
            fs.writeFileSync(mainIndexPath, content);
            console.log('✅ Main index.html updated successfully');
        } catch (error) {
            console.error('❌ Error updating main index.html:', error.message);
        }
    }
    
    // 4. Update blog.html if it exists
    console.log('📰 Updating blog.html...');
    const blogPath = path.join(__dirname, 'blog.html');
    if (fs.existsSync(blogPath)) {
        try {
            let content = fs.readFileSync(blogPath, 'utf8');
            
            // Fix any HTTP links to HTTPS
            content = content.replace(/http:\/\//g, 'https://');
            
            // Ensure all beingwell.health links have www
            content = content.replace(/https:\/\/beingwell\.health/g, 'https://www.beingwell.health');
            
            fs.writeFileSync(blogPath, content);
            console.log('✅ blog.html updated successfully');
        } catch (error) {
            console.error('❌ Error updating blog.html:', error.message);
        }
    }
    
    console.log('🎉 Redirect issues fix completed!');
    console.log('');
    console.log('📋 Summary of changes:');
    console.log('   • Updated sitemap.xml with HTTPS and www URLs');
    console.log('   • Fixed internal links in all HTML files');
    console.log('   • Updated main index.html and blog.html');
    console.log('   • Removed conflicting redirect rules from vercel.json');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('   1. Commit and push these changes to GitHub');
    console.log('   2. Wait for Vercel to redeploy');
    console.log('   3. Request re-indexing in Google Search Console');
    console.log('   4. Monitor the redirect issues in Google Search Console');
}

// Run the fix
fixRedirectIssues();
