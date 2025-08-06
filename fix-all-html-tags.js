#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

class HTMLTagFixer {
    constructor() {
        this.fixedFiles = [];
        this.errors = [];
    }

    async run() {
        console.log('🔧 Starting HTML Tag Fix...\n');
        
        // Find all HTML files
        const htmlFiles = await this.findHtmlFiles('.');
        
        console.log(`📄 Found ${htmlFiles.length} HTML files to check...\n`);
        
        for (const filePath of htmlFiles) {
            try {
                await this.fixHtmlTagsInFile(filePath);
            } catch (error) {
                console.error(`❌ Error processing ${filePath}:`, error.message);
                this.errors.push({ file: filePath, error: error.message });
            }
        }
        
        this.generateReport();
    }

    async findHtmlFiles(dir) {
        const files = [];
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && item !== 'seo-reports') {
                const subFiles = await this.findHtmlFiles(fullPath);
                files.push(...subFiles);
            } else if (item.endsWith('.html')) {
                files.push(fullPath);
            }
        }
        
        return files;
    }

    async fixHtmlTagsInFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const $ = cheerio.load(content);
        
        let hasChanges = false;
        
        // Fix meta descriptions
        const metaDescription = $('meta[name="description"]');
        metaDescription.each((i, elem) => {
            const content = $(elem).attr('content');
            if (content && this.hasBrokenHtml(content)) {
                const fixedContent = this.cleanHtmlContent(content);
                $(elem).attr('content', fixedContent);
                hasChanges = true;
                console.log(`✅ Fixed meta description in ${filePath}`);
            }
        });
        
        // Fix meta keywords
        const metaKeywords = $('meta[name="keywords"]');
        metaKeywords.each((i, elem) => {
            const content = $(elem).attr('content');
            if (content && this.hasBrokenHtml(content)) {
                const fixedContent = this.cleanHtmlContent(content);
                $(elem).attr('content', fixedContent);
                hasChanges = true;
                console.log(`✅ Fixed meta keywords in ${filePath}`);
            }
        });
        
        // Fix schema markup
        const schemaScripts = $('script[type="application/ld+json"]');
        schemaScripts.each((i, elem) => {
            const scriptContent = $(elem).html();
            if (scriptContent && this.hasBrokenHtml(scriptContent)) {
                const fixedContent = this.cleanHtmlContent(scriptContent);
                $(elem).html(fixedContent);
                hasChanges = true;
                console.log(`✅ Fixed schema markup in ${filePath}`);
            }
        });
        
        if (hasChanges) {
            fs.writeFileSync(filePath, $.html());
            this.fixedFiles.push(filePath);
        }
    }

    hasBrokenHtml(content) {
        return content.includes('<a href') || 
               content.includes('onclick') || 
               content.includes('class="') ||
               content.includes('text-purple') ||
               content.includes('</head>') ||
               content.includes('</body>') ||
               content.includes('&gt;') ||
               content.includes('&lt;');
    }

    cleanHtmlContent(content) {
        // Remove HTML tags and clean up the content
        let cleaned = content
            .replace(/<a[^>]*>/g, '') // Remove opening <a> tags
            .replace(/<\/a>/g, '') // Remove closing </a> tags
            .replace(/onclick="[^"]*"/g, '') // Remove onclick attributes
            .replace(/class="[^"]*"/g, '') // Remove class attributes
            .replace(/href="[^"]*"/g, '') // Remove href attributes
            .replace(/text-purple-[^"]*"/g, '') // Remove text-purple classes
            .replace(/hover:text-purple-[^"]*"/g, '') // Remove hover classes
            .replace(/underline"/g, '') // Remove underline class
            .replace(/<\/head>/g, '') // Remove </head> tag
            .replace(/<\/body>/g, '') // Remove </body> tag
            .replace(/&gt;/g, '') // Remove &gt;
            .replace(/&lt;/g, '') // Remove &lt;
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
        
        return cleaned;
    }

    generateReport() {
        console.log('\n📊 HTML Tag Fix Report');
        console.log('=======================');
        console.log(`✅ Files fixed: ${this.fixedFiles.length}`);
        console.log(`❌ Errors: ${this.errors.length}`);
        
        if (this.fixedFiles.length > 0) {
            console.log('\nFixed files:');
            this.fixedFiles.forEach(file => console.log(`  - ${file}`));
        }
        
        if (this.errors.length > 0) {
            console.log('\nErrors:');
            this.errors.forEach(error => console.log(`  - ${error.file}: ${error.error}`));
        }
        
        // Save detailed report
        const report = `# HTML Tag Fix Report - ${new Date().toISOString()}

## Summary
- Files processed: ${this.fixedFiles.length + this.errors.length}
- Files fixed: ${this.fixedFiles.length}
- Errors: ${this.errors.length}

## Fixed Files
${this.fixedFiles.map(file => `- ${file}`).join('\n')}

## Errors
${this.errors.map(error => `- ${error.file}: ${error.error}`).join('\n')}
`;
        
        fs.writeFileSync('html-tag-fix-report.md', report);
        console.log('\n📄 Detailed report saved to: html-tag-fix-report.md');
    }
}

// Run the fixer
async function main() {
    try {
        const fixer = new HTMLTagFixer();
        await fixer.run();
    } catch (error) {
        console.error('❌ Fix failed:', error.message);
        process.exit(1);
    }
}

main(); 