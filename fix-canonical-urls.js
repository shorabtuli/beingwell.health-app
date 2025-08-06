#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

class CanonicalFixer {
    constructor() {
        this.fixedFiles = [];
        this.errors = [];
    }

    async run() {
        console.log('🔧 Starting Canonical URL Fix...\n');
        
        // Find all HTML files
        const htmlFiles = await this.findHtmlFiles('.');
        
        console.log(`📄 Found ${htmlFiles.length} HTML files to check...\n`);
        
        for (const filePath of htmlFiles) {
            try {
                await this.fixCanonicalInFile(filePath);
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

    async fixCanonicalInFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const $ = cheerio.load(content);
        
        const canonical = $('link[rel="canonical"]');
        let hasChanges = false;
        
        canonical.each((i, elem) => {
            const href = $(elem).attr('href');
            
            if (href && this.isBrokenCanonical(href)) {
                const fixedHref = this.fixCanonicalUrl(href, filePath);
                
                if (fixedHref !== href) {
                    $(elem).attr('href', fixedHref);
                    hasChanges = true;
                    console.log(`✅ Fixed canonical in ${filePath}: ${href} → ${fixedHref}`);
                }
            }
        });
        
        if (hasChanges) {
            fs.writeFileSync(filePath, $.html());
            this.fixedFiles.push(filePath);
        }
    }

    isBrokenCanonical(href) {
        return href.includes('<a href') || 
               href.includes('onclick') || 
               href.includes('class="') ||
               href.includes('text-purple');
    }

    fixCanonicalUrl(href, filePath) {
        // Extract the base URL from the file path
        const relativePath = path.relative('.', filePath);
        const urlPath = '/' + relativePath.replace(/\\/g, '/');
        
        // Create the correct canonical URL
        return `https://www.beingwell.health${urlPath}`;
    }

    generateReport() {
        console.log('\n📊 Canonical Fix Report');
        console.log('========================');
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
        const report = `# Canonical URL Fix Report - ${new Date().toISOString()}

## Summary
- Files processed: ${this.fixedFiles.length + this.errors.length}
- Files fixed: ${this.fixedFiles.length}
- Errors: ${this.errors.length}

## Fixed Files
${this.fixedFiles.map(file => `- ${file}`).join('\n')}

## Errors
${this.errors.map(error => `- ${error.file}: ${error.error}`).join('\n')}
`;
        
        fs.writeFileSync('canonical-fix-report.md', report);
        console.log('\n📄 Detailed report saved to: canonical-fix-report.md');
    }
}

// Run the fixer
async function main() {
    try {
        const fixer = new CanonicalFixer();
        await fixer.run();
    } catch (error) {
        console.error('❌ Fix failed:', error.message);
        process.exit(1);
    }
}

main(); 