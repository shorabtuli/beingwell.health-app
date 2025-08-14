#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class GoogleConsoleVerifier {
    constructor() {
        this.issues = [];
        this.stats = {
            totalFiles: 0,
            filesWithRobotsTag: 0,
            filesWithCanonical: 0,
            filesWithTitle: 0,
            filesWithDescription: 0,
            filesWithKeywords: 0,
            filesWithSchema: 0
        };
    }

    async run() {
        console.log('🔍 Verifying Google Console readiness...\n');
        
        await this.analyzeBlogFiles();
        this.checkSitemap();
        this.checkRobotsTxt();
        this.generateReport();
    }

    async analyzeBlogFiles() {
        const blogPostsDir = './blog-posts';
        const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
        
        this.stats.totalFiles = files.length;
        
        files.forEach(file => {
            const filePath = path.join(blogPostsDir, file);
            this.analyzeFile(filePath, file);
        });
    }

    analyzeFile(filePath, fileName) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Check for robots meta tag
            if (content.includes('meta name="robots"')) {
                this.stats.filesWithRobotsTag++;
            } else {
                this.issues.push(`❌ ${fileName}: Missing robots meta tag`);
            }
            
            // Check for canonical URL
            if (content.includes('rel="canonical"')) {
                this.stats.filesWithCanonical++;
            } else {
                this.issues.push(`❌ ${fileName}: Missing canonical URL`);
            }
            
            // Check for title tag
            if (content.includes('<title>')) {
                this.stats.filesWithTitle++;
            } else {
                this.issues.push(`❌ ${fileName}: Missing title tag`);
            }
            
            // Check for meta description
            if (content.includes('meta name="description"')) {
                this.stats.filesWithDescription++;
            } else {
                this.issues.push(`❌ ${fileName}: Missing meta description`);
            }
            
            // Check for keywords
            if (content.includes('meta name="keywords"')) {
                this.stats.filesWithKeywords++;
            } else {
                this.issues.push(`❌ ${fileName}: Missing keywords meta tag`);
            }
            
            // Check for schema markup
            if (content.includes('application/ld+json')) {
                this.stats.filesWithSchema++;
            } else {
                this.issues.push(`❌ ${fileName}: Missing schema markup`);
            }
            
            // Check for noindex directives
            if (content.includes('noindex')) {
                this.issues.push(`❌ ${fileName}: Contains noindex directive`);
            }
            
        } catch (error) {
            this.issues.push(`❌ ${fileName}: Error reading file - ${error.message}`);
        }
    }

    checkSitemap() {
        try {
            const sitemapContent = fs.readFileSync('sitemap.xml', 'utf8');
            const urlCount = (sitemapContent.match(/<url>/g) || []).length;
            
            console.log(`📋 Sitemap Analysis:`);
            console.log(`   - URLs in sitemap: ${urlCount}`);
            console.log(`   - Blog files: ${this.stats.totalFiles}`);
            console.log(`   - Main pages: ${urlCount - this.stats.totalFiles}`);
            
            if (urlCount < this.stats.totalFiles + 3) {
                this.issues.push(`❌ Sitemap: Missing URLs (expected ${this.stats.totalFiles + 3}, found ${urlCount})`);
            }
            
            if (!sitemapContent.includes('https://www.beingwell.health/')) {
                this.issues.push(`❌ Sitemap: Missing homepage URL`);
            }
            
        } catch (error) {
            this.issues.push(`❌ Sitemap: Error reading sitemap.xml - ${error.message}`);
        }
    }

    checkRobotsTxt() {
        try {
            const robotsContent = fs.readFileSync('robots.txt', 'utf8');
            
            console.log(`\n🤖 Robots.txt Analysis:`);
            
            if (!robotsContent.includes('Sitemap:')) {
                this.issues.push(`❌ Robots.txt: Missing sitemap reference`);
            } else {
                console.log(`   ✅ Sitemap reference found`);
            }
            
            if (!robotsContent.includes('Allow: /')) {
                this.issues.push(`❌ Robots.txt: Missing Allow directive`);
            } else {
                console.log(`   ✅ Allow directive found`);
            }
            
            if (robotsContent.includes('Disallow: /blog-posts/')) {
                this.issues.push(`❌ Robots.txt: Blog posts are disallowed`);
            } else {
                console.log(`   ✅ Blog posts are allowed`);
            }
            
        } catch (error) {
            this.issues.push(`❌ Robots.txt: Error reading robots.txt - ${error.message}`);
        }
    }

    generateReport() {
        console.log(`\n📊 File Analysis Summary:`);
        console.log(`   - Total blog files: ${this.stats.totalFiles}`);
        console.log(`   - Files with robots tag: ${this.stats.filesWithRobotsTag} (${((this.stats.filesWithRobotsTag / this.stats.totalFiles) * 100).toFixed(1)}%)`);
        console.log(`   - Files with canonical: ${this.stats.filesWithCanonical} (${((this.stats.filesWithCanonical / this.stats.totalFiles) * 100).toFixed(1)}%)`);
        console.log(`   - Files with title: ${this.stats.filesWithTitle} (${((this.stats.filesWithTitle / this.stats.totalFiles) * 100).toFixed(1)}%)`);
        console.log(`   - Files with description: ${this.stats.filesWithDescription} (${((this.stats.filesWithDescription / this.stats.totalFiles) * 100).toFixed(1)}%)`);
        console.log(`   - Files with keywords: ${this.stats.filesWithKeywords} (${((this.stats.filesWithKeywords / this.stats.totalFiles) * 100).toFixed(1)}%)`);
        console.log(`   - Files with schema: ${this.stats.filesWithSchema} (${((this.stats.filesWithSchema / this.stats.totalFiles) * 100).toFixed(1)}%)`);
        
        if (this.issues.length === 0) {
            console.log(`\n🎉 SUCCESS: All files are ready for Google Console!`);
            console.log(`✅ No critical issues found`);
            console.log(`✅ All blog files have proper SEO elements`);
            console.log(`✅ Sitemap and robots.txt are properly configured`);
            console.log(`\n🔍 Google Console should now be able to find and index all your pages.`);
            console.log(`📝 Next steps:`);
            console.log(`   1. Submit your sitemap to Google Search Console`);
            console.log(`   2. Request indexing for your main pages`);
            console.log(`   3. Monitor the indexing status in Google Console`);
        } else {
            console.log(`\n⚠️  ISSUES FOUND (${this.issues.length}):`);
            this.issues.forEach(issue => console.log(`   ${issue}`));
            console.log(`\n🔧 Please fix these issues before submitting to Google Console.`);
        }
    }
}

// Run the verification
const verifier = new GoogleConsoleVerifier();
verifier.run(); 