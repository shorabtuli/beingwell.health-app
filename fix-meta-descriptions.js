#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

class MetaDescriptionFixer {
    constructor() {
        this.fixedFiles = [];
        this.errors = [];
    }

    async run() {
        console.log('🔧 Starting Meta Description Fix...\n');
        
        // Find all HTML files
        const htmlFiles = await this.findHtmlFiles('.');
        
        console.log(`📄 Found ${htmlFiles.length} HTML files to check...\n`);
        
        for (const filePath of htmlFiles) {
            try {
                await this.fixMetaDescriptionInFile(filePath);
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

    async fixMetaDescriptionInFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const $ = cheerio.load(content);
        
        const metaDescription = $('meta[name="description"]');
        let hasChanges = false;
        
        metaDescription.each((i, elem) => {
            const content = $(elem).attr('content');
            
            if (content && this.isBrokenMetaDescription(content)) {
                const fixedContent = this.fixMetaDescription(content);
                
                if (fixedContent !== content) {
                    $(elem).attr('content', fixedContent);
                    hasChanges = true;
                    console.log(`✅ Fixed meta description in ${filePath}`);
                }
            }
        });
        
        if (hasChanges) {
            fs.writeFileSync(filePath, $.html());
            this.fixedFiles.push(filePath);
        }
    }

    isBrokenMetaDescription(content) {
        return content.includes('<a href') || 
               content.includes('onclick') || 
               content.includes('class="') ||
               content.includes('text-purple') ||
               content.includes('</head>');
    }

    fixMetaDescription(content) {
        // Remove HTML tags and clean up the description
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
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
        
        // Ensure the description is not too long (Google recommends 150-160 characters)
        if (cleaned.length > 160) {
            cleaned = cleaned.substring(0, 157) + '...';
        }
        
        return cleaned;
    }

    generateReport() {
        console.log('\n📊 Meta Description Fix Report');
        console.log('==============================');
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
        const report = `# Meta Description Fix Report - ${new Date().toISOString()}

## Summary
- Files processed: ${this.fixedFiles.length + this.errors.length}
- Files fixed: ${this.fixedFiles.length}
- Errors: ${this.errors.length}

## Fixed Files
${this.fixedFiles.map(file => `- ${file}`).join('\n')}

## Errors
${this.errors.map(error => `- ${error.file}: ${error.error}`).join('\n')}
`;
        
        fs.writeFileSync('meta-description-fix-report.md', report);
        console.log('\n📄 Detailed report saved to: meta-description-fix-report.md');
    }
}

// Run the fixer
async function main() {
    try {
        const fixer = new MetaDescriptionFixer();
        await fixer.run();
    } catch (error) {
        console.error('❌ Fix failed:', error.message);
        process.exit(1);
    }
}

main(); 