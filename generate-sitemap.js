const fs = require('fs');
const path = require('path');

// Get all blog post files
const blogPostsDir = './blog-posts';
const blogPosts = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));

// Generate sitemap XML
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Pages -->
  <url>
    <loc>https://www.beingwell.health/</loc>
    <lastmod>2025-07-30T15:22:27+00:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.beingwell.health/index.html</loc>
    <lastmod>2025-07-30T15:22:28+00:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.beingwell.health/blog.html</loc>
    <lastmod>2025-07-30T15:22:27+00:00</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

// Add all blog posts
blogPosts.forEach(post => {
  const postName = post.replace('.html', '');
  sitemap += `
  <url>
    <loc>https://www.beingwell.health/blog-posts/${post}</loc>
    <lastmod>2025-07-30T15:22:30+00:00</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
});

sitemap += `
</urlset>`;

// Write sitemap to file
fs.writeFileSync('sitemap.xml', sitemap);

console.log(`✅ Generated sitemap with ${blogPosts.length + 3} URLs (${blogPosts.length} blog posts + 3 main pages)`);
console.log(`📁 Sitemap saved as sitemap.xml`); 