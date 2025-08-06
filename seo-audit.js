#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { URL } = require('url');

class SEOAuditor {
    constructor() {
        this.sitemapUrls = new Set();
        this.htmlFiles = [];
        this.issues = [];
        this.orphanPages = [];
        this.noindexPages = [];
        this.canonicalIssues = [];
    }

    async run() {
        console.log('🔍 Starting SEO Audit...\n');
        
        // Parse sitemap
        await this.parseSitemap();
        
        // Find all HTML files
        await this.findHtmlFiles('.');
        
        // Analyze each HTML file
        await this.analyzeHtmlFiles();
        
        // Generate reports
        this.generateReports();
        
        console.log('✅ SEO Audit Complete!\n');
    }

    async parseSitemap() {
        try {
            const sitemapContent = fs.readFileSync('sitemap.xml', 'utf8');
            const $ = cheerio.load(sitemapContent, { xmlMode: true });
            
            $('url').each((i, elem) => {
                const loc = $(elem).find('loc').text();
                if (loc) {
                    const url = new URL(loc);
                    this.sitemapUrls.add(url.pathname);
                }
            });
            
            console.log(`📋 Found ${this.sitemapUrls.size} URLs in sitemap`);
        } catch (error) {
            console.error('❌ Error parsing sitemap:', error.message);
        }
    }

    async findHtmlFiles(dir) {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                await this.findHtmlFiles(fullPath);
            } else if (item.endsWith('.html')) {
                this.htmlFiles.push(fullPath);
            }
        }
    }

    async analyzeHtmlFiles() {
        console.log(`📄 Analyzing ${this.htmlFiles.length} HTML files...\n`);
        
        for (const filePath of this.htmlFiles) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const $ = cheerio.load(content);
                
                const relativePath = path.relative('.', filePath);
                const urlPath = '/' + relativePath.replace(/\\/g, '/');
                
                // Check meta robots
                this.checkMetaRobots($, filePath, urlPath);
                
                // Check canonical tags
                this.checkCanonicalTags($, filePath, urlPath);
                
                // Check for thin content
                this.checkContentLength($, filePath, urlPath);
                
                // Check structured data
                this.checkStructuredData($, filePath, urlPath);
                
                // Check for orphan pages
                this.checkOrphanPages(filePath, urlPath);
                
            } catch (error) {
                console.error(`❌ Error analyzing ${filePath}:`, error.message);
            }
        }
    }

    checkMetaRobots($, filePath, urlPath) {
        const robotsMeta = $('meta[name="robots"]');
        
        if (robotsMeta.length > 0) {
            const content = robotsMeta.attr('content');
            if (content && content.includes('noindex')) {
                this.noindexPages.push({
                    file: filePath,
                    url: urlPath,
                    issue: 'Has noindex meta tag',
                    fix: 'Remove noindex or change to "index, follow"'
                });
            }
        }
    }

    checkCanonicalTags($, filePath, urlPath) {
        const canonical = $('link[rel="canonical"]');
        
        if (canonical.length > 0) {
            const href = canonical.attr('href');
            
            if (href) {
                // Check for broken canonical URLs
                if (href.includes('<a href') || href.includes('onclick')) {
                    this.canonicalIssues.push({
                        file: filePath,
                        url: urlPath,
                        issue: 'Broken canonical URL with HTML tags',
                        fix: 'Fix canonical URL to be clean URL only'
                    });
                }
                
                // Check for canonical pointing to different domain
                if (href.includes('beingwell.health') && !href.startsWith('https://www.beingwell.health')) {
                    this.canonicalIssues.push({
                        file: filePath,
                        url: urlPath,
                        issue: 'Canonical points to different domain',
                        fix: 'Update canonical to point to correct domain'
                    });
                }
            }
        }
    }

    checkContentLength($, filePath, urlPath) {
        const text = $.text();
        const wordCount = text.split(/\s+/).length;
        
        if (wordCount < 300) {
            this.issues.push({
                file: filePath,
                url: urlPath,
                issue: `Thin content (${wordCount} words)`,
                fix: 'Add more relevant content to reach at least 300 words'
            });
        }
    }

    checkStructuredData($, filePath, urlPath) {
        const scripts = $('script[type="application/ld+json"]');
        
        if (scripts.length === 0) {
            this.issues.push({
                file: filePath,
                url: urlPath,
                issue: 'Missing structured data',
                fix: 'Add JSON-LD schema.org markup'
            });
        }
    }

    checkOrphanPages(filePath, urlPath) {
        if (!this.sitemapUrls.has(urlPath)) {
            this.orphanPages.push({
                file: filePath,
                url: urlPath,
                issue: 'Page not in sitemap',
                fix: 'Add page to sitemap.xml'
            });
        }
    }

    generateReports() {
        console.log('📊 Generating Reports...\n');
        
        // Create reports directory
        if (!fs.existsSync('seo-reports')) {
            fs.mkdirSync('seo-reports');
        }
        
        // Generate main report
        this.generateMainReport();
        
        // Generate specific issue reports
        this.generateIssueReports();
        
        // Generate summary
        this.generateSummary();
    }

    generateMainReport() {
        const report = `# SEO Audit Report - ${new Date().toISOString()}

## Summary
- Total HTML files analyzed: ${this.htmlFiles.length}
- URLs in sitemap: ${this.sitemapUrls.size}
- Issues found: ${this.issues.length + this.noindexPages.length + this.canonicalIssues.length + this.orphanPages.length}

## Issues Found

### Meta Robots Issues (${this.noindexPages.length})
${this.noindexPages.map(item => `- ${item.file}: ${item.issue} - ${item.fix}`).join('\n')}

### Canonical Issues (${this.canonicalIssues.length})
${this.canonicalIssues.map(item => `- ${item.file}: ${item.issue} - ${item.fix}`).join('\n')}

### Orphan Pages (${this.orphanPages.length})
${this.orphanPages.map(item => `- ${item.file}: ${item.issue} - ${item.fix}`).join('\n')}

### Other Issues (${this.issues.length})
${this.issues.map(item => `- ${item.file}: ${item.issue} - ${item.fix}`).join('\n')}

## Priority Pages Analysis
${this.getPriorityPagesAnalysis()}
`;
        
        fs.writeFileSync('seo-reports/main-report.md', report);
        console.log('📄 Main report saved to: seo-reports/main-report.md');
    }

    generateIssueReports() {
        // Orphan pages report
        const orphanReport = this.orphanPages.map(item => 
            `${item.url}\t${item.file}\t${item.issue}\t${item.fix}`
        ).join('\n');
        fs.writeFileSync('seo-reports/orphan-pages.txt', orphanReport);
        
        // Noindex pages report
        const noindexReport = this.noindexPages.map(item => 
            `${item.url}\t${item.file}\t${item.issue}\t${item.fix}`
        ).join('\n');
        fs.writeFileSync('seo-reports/noindex-pages.txt', noindexReport);
        
        // Canonical issues report
        const canonicalReport = this.canonicalIssues.map(item => 
            `${item.url}\t${item.file}\t${item.issue}\t${item.fix}`
        ).join('\n');
        fs.writeFileSync('seo-reports/canonical-issues.txt', canonicalReport);
        
        console.log('📄 Issue reports saved to: seo-reports/');
    }

    generateSummary() {
        const summary = `
SEO AUDIT SUMMARY
=================

Files Analyzed: ${this.htmlFiles.length}
Sitemap URLs: ${this.sitemapUrls.size}

CRITICAL ISSUES:
- Noindex pages: ${this.noindexPages.length}
- Broken canonical URLs: ${this.canonicalIssues.length}
- Orphan pages: ${this.orphanPages.length}
- Thin content: ${this.issues.filter(i => i.issue.includes('Thin content')).length}
- Missing structured data: ${this.issues.filter(i => i.issue.includes('structured data')).length}

TOP PRIORITY FIXES:
${this.getTopPriorityFixes()}
`;
        
        fs.writeFileSync('seo-reports/summary.txt', summary);
        console.log('📄 Summary saved to: seo-reports/summary.txt');
    }

    getPriorityPagesAnalysis() {
        const priorityPages = [
            '/',
            '/index.html',
            '/blog.html',
            '/blog-posts/how-to-reduce-morning-joint-stiffness.html',
            '/blog-posts/healthy-habits-chronic-illness.html'
        ];
        
        let analysis = '';
        for (const page of priorityPages) {
            const filePath = this.htmlFiles.find(f => f.includes(page.replace('/', '')));
            if (filePath) {
                const hasIssues = this.issues.some(i => i.url === page) ||
                                 this.noindexPages.some(i => i.url === page) ||
                                 this.canonicalIssues.some(i => i.url === page);
                
                analysis += `${page}: ${hasIssues ? '❌ HAS ISSUES' : '✅ CLEAN'}\n`;
            }
        }
        
        return analysis;
    }

    getTopPriorityFixes() {
        const fixes = [];
        
        // Critical: Fix broken canonical URLs
        if (this.canonicalIssues.length > 0) {
            fixes.push(`1. Fix ${this.canonicalIssues.length} broken canonical URLs (critical for indexing)`);
        }
        
        // Critical: Remove noindex tags
        if (this.noindexPages.length > 0) {
            fixes.push(`2. Remove noindex tags from ${this.noindexPages.length} pages`);
        }
        
        // Important: Add orphan pages to sitemap
        if (this.orphanPages.length > 0) {
            fixes.push(`3. Add ${this.orphanPages.length} orphan pages to sitemap`);
        }
        
        return fixes.join('\n');
    }
}

// Run the audit
async function main() {
    try {
        const auditor = new SEOAuditor();
        await auditor.run();
    } catch (error) {
        console.error('❌ Audit failed:', error.message);
        process.exit(1);
    }
}

main(); 