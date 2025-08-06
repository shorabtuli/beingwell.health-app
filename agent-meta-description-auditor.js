const fs = require('fs');
const path = require('path');

class MetaDescriptionAuditor {
    constructor() {
        this.filesToCheck = [
            'index.html',
            'blog.html'
        ];
        this.blogPostsDir = 'blog-posts';
        this.metaDescriptions = new Map();
        this.duplicates = [];
        this.fixedFiles = [];
    }

    async auditMetaDescriptions() {
        console.log('🔍 Agent 3: Duplicate Meta Description Auditor');
        console.log('=' .repeat(50));
        
        // Collect all meta descriptions
        await this.collectMetaDescriptions();
        
        // Find duplicates
        this.findDuplicates();
        
        // Fix duplicates
        await this.fixDuplicates();
        
        // Generate report
        this.generateReport();
    }

    async collectMetaDescriptions() {
        console.log('\n📄 Collecting meta descriptions from all files...');
        
        // Check main pages
        for (const file of this.filesToCheck) {
            if (fs.existsSync(file)) {
                await this.processFileForCollection(file);
            }
        }

        // Check blog posts
        if (fs.existsSync(this.blogPostsDir)) {
            const blogFiles = fs.readdirSync(this.blogPostsDir).filter(file => file.endsWith('.html'));
            console.log(`\n📝 Checking ${blogFiles.length} blog posts...`);
            
            for (const file of blogFiles) {
                const filePath = path.join(this.blogPostsDir, file);
                await this.processFileForCollection(filePath);
            }
        }
    }

    async processFileForCollection(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const metaDescRegex = /<meta\s+name\s*=\s*["']description["']\s+content\s*=\s*["']([^"']*)["']/gi;
        const matches = content.match(metaDescRegex) || [];
        
        for (const match of matches) {
            const content = match.match(/content\s*=\s*["']([^"']*)["']/i)?.[1] || '';
            if (content.trim()) {
                if (!this.metaDescriptions.has(content)) {
                    this.metaDescriptions.set(content, []);
                }
                this.metaDescriptions.get(content).push(filePath);
            }
        }
    }

    findDuplicates() {
        console.log('\n🔍 Finding duplicate meta descriptions...');
        
        for (const [description, files] of this.metaDescriptions) {
            if (files.length > 1) {
                this.duplicates.push({
                    description: description,
                    files: files,
                    count: files.length
                });
                
                console.log(`\n⚠️  Duplicate found (${files.length} files):`);
                console.log(`   Description: "${description.substring(0, 80)}..."`);
                console.log(`   Files:`);
                files.forEach(file => {
                    console.log(`     • ${file}`);
                });
            }
        }
        
        if (this.duplicates.length === 0) {
            console.log('\n✅ No duplicate meta descriptions found!');
        }
    }

    async fixDuplicates() {
        if (this.duplicates.length === 0) return;
        
        console.log('\n🔧 Fixing duplicate meta descriptions...');
        
        for (const duplicate of this.duplicates) {
            // Keep the first file's description, update others
            const keepFile = duplicate.files[0];
            const updateFiles = duplicate.files.slice(1);
            
            console.log(`\n📝 Keeping original in: ${keepFile}`);
            console.log(`   Updating ${updateFiles.length} files with unique descriptions...`);
            
            for (const filePath of updateFiles) {
                await this.updateMetaDescription(filePath, duplicate.description);
            }
        }
    }

    async updateMetaDescription(filePath, oldDescription) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Generate unique description based on file content
        const uniqueDescription = this.generateUniqueDescription(filePath, oldDescription);
        
        // Replace the meta description
        const metaDescRegex = /<meta\s+name\s*=\s*["']description["']\s+content\s*=\s*["'][^"']*["']/gi;
        const newMetaTag = `<meta name="description" content="${uniqueDescription}"`;
        
        content = content.replace(metaDescRegex, newMetaTag);
        
        fs.writeFileSync(filePath, content, 'utf8');
        this.fixedFiles.push(filePath);
        
        console.log(`   ✅ Updated: ${filePath}`);
        console.log(`      New description: "${uniqueDescription.substring(0, 80)}..."`);
    }

    generateUniqueDescription(filePath, oldDescription) {
        // Extract context from file path and content
        const fileName = path.basename(filePath, '.html');
        const isBlogPost = filePath.includes('blog-posts/');
        
        if (isBlogPost) {
            // Generate blog post specific description
            const topic = this.extractTopicFromFileName(fileName);
            return `Learn about ${topic} for rheumatoid arthritis management. Expert tips, strategies, and personalized advice for RA patients from Being Well.`;
        } else if (filePath.includes('blog.html')) {
            return 'Discover 400+ expert articles on rheumatoid arthritis management. From pain relief to exercise routines, nutrition tips to sleep strategies - everything you need for better RA wellness.';
        } else if (filePath.includes('index.html')) {
            return 'Finally, a wellness app that understands your RA journey. Personalized daily plans that adapt to your pain levels, energy, and goals. Built by someone who gets it.';
        }
        
        // Fallback for other files
        return `Comprehensive rheumatoid arthritis management resources and personalized wellness plans from Being Well. Expert guidance for RA patients.`;
    }

    extractTopicFromFileName(fileName) {
        // Convert filename to readable topic
        const topic = fileName
            .replace(/-/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .replace(/\bRa\b/g, 'RA')
            .replace(/\bArthritis\b/g, 'arthritis');
        
        return topic;
    }

    generateReport() {
        console.log('\n📊 Audit Report:');
        console.log('=' .repeat(30));
        
        console.log(`Total files checked: ${this.filesToCheck.length + (fs.existsSync(this.blogPostsDir) ? fs.readdirSync(this.blogPostsDir).filter(f => f.endsWith('.html')).length : 0)}`);
        console.log(`Duplicate meta descriptions found: ${this.duplicates.length}`);
        console.log(`Files updated: ${this.fixedFiles.length}`);
        
        if (this.duplicates.length > 0) {
            console.log('\n📝 Duplicate Summary:');
            this.duplicates.forEach((dup, index) => {
                console.log(`${index + 1}. "${dup.description.substring(0, 60)}..." (${dup.count} files)`);
            });
        }
        
        if (this.fixedFiles.length > 0) {
            console.log('\n✅ Fixed Files:');
            this.fixedFiles.forEach(file => {
                console.log(`  • ${file}`);
            });
        }
        
        // Save detailed report
        const report = {
            timestamp: new Date().toISOString(),
            totalFiles: this.filesToCheck.length + (fs.existsSync(this.blogPostsDir) ? fs.readdirSync(this.blogPostsDir).filter(f => f.endsWith('.html')).length : 0),
            duplicatesFound: this.duplicates.length,
            filesUpdated: this.fixedFiles.length,
            duplicates: this.duplicates,
            fixedFiles: this.fixedFiles
        };
        
        fs.writeFileSync('meta-description-audit.json', JSON.stringify(report, null, 2));
        console.log('\n💾 Detailed report saved to meta-description-audit.json');
    }
}

// Run the agent
const agent = new MetaDescriptionAuditor();
agent.auditMetaDescriptions().catch(console.error); 