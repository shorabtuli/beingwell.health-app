const fs = require('fs');
const path = require('path');

class ContentLengthAuditor {
    constructor() {
        this.filesToCheck = [
            'index.html',
            'blog.html'
        ];
        this.blogPostsDir = 'blog-posts';
        this.shortPages = [];
        this.wordCounts = [];
        this.recommendations = [];
    }

    async auditContentLength() {
        console.log('🔍 Agent 4: Content Length Auditor');
        console.log('=' .repeat(50));
        
        // Check main pages
        for (const file of this.filesToCheck) {
            if (fs.existsSync(file)) {
                await this.processFile(file);
            }
        }

        // Check blog posts
        if (fs.existsSync(this.blogPostsDir)) {
            const blogFiles = fs.readdirSync(this.blogPostsDir).filter(file => file.endsWith('.html'));
            console.log(`\n📝 Checking ${blogFiles.length} blog posts...`);
            
            for (const file of blogFiles) {
                const filePath = path.join(this.blogPostsDir, file);
                await this.processFile(filePath);
            }
        }

        this.generateReport();
        this.generateRecommendations();
    }

    async processFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract text content (remove HTML tags and scripts)
        const textContent = this.extractTextContent(content);
        const wordCount = this.countWords(textContent);
        
        const result = {
            file: filePath,
            wordCount: wordCount,
            isShort: wordCount < 500,
            content: textContent.substring(0, 200) + '...'
        };
        
        this.wordCounts.push(result);
        
        if (result.isShort) {
            this.shortPages.push(result);
        }
        
        console.log(`📄 ${filePath}: ${wordCount} words ${result.isShort ? '⚠️  (SHORT)' : '✅'}`);
    }

    extractTextContent(htmlContent) {
        // Remove script and style tags
        let content = htmlContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        
        // Remove HTML tags but keep text
        content = content.replace(/<[^>]*>/g, ' ');
        
        // Remove extra whitespace
        content = content.replace(/\s+/g, ' ').trim();
        
        return content;
    }

    countWords(text) {
        if (!text) return 0;
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }

    generateReport() {
        console.log('\n📊 Content Length Report:');
        console.log('=' .repeat(30));
        
        const totalFiles = this.wordCounts.length;
        const shortPages = this.shortPages.length;
        const averageWords = this.wordCounts.reduce((sum, page) => sum + page.wordCount, 0) / totalFiles;
        
        console.log(`Total pages analyzed: ${totalFiles}`);
        console.log(`Pages under 500 words: ${shortPages}`);
        console.log(`Average word count: ${Math.round(averageWords)}`);
        
        if (shortPages > 0) {
            console.log('\n⚠️  Pages Under 500 Words:');
            this.shortPages.forEach(page => {
                console.log(`\n📄 ${page.file}`);
                console.log(`   Word count: ${page.wordCount}`);
                console.log(`   Content preview: "${page.content}"`);
            });
        } else {
            console.log('\n✅ All pages have sufficient content (500+ words)');
        }
        
        // Save detailed report
        const report = {
            timestamp: new Date().toISOString(),
            totalFiles: totalFiles,
            shortPages: shortPages,
            averageWords: Math.round(averageWords),
            shortPagesDetails: this.shortPages,
            allPages: this.wordCounts
        };
        
        fs.writeFileSync('content-length-audit.json', JSON.stringify(report, null, 2));
        console.log('\n💾 Detailed report saved to content-length-audit.json');
    }

    generateRecommendations() {
        console.log('\n💡 Content Enhancement Recommendations:');
        console.log('=' .repeat(40));
        
        if (this.shortPages.length === 0) {
            console.log('✅ All pages have sufficient content length!');
            return;
        }
        
        console.log('\n📝 Recommended Content Additions:');
        
        this.shortPages.forEach(page => {
            const fileName = path.basename(page.file, '.html');
            const recommendations = this.getRecommendationsForPage(fileName, page.wordCount);
            
            console.log(`\n📄 ${page.file} (${page.wordCount} words):`);
            recommendations.forEach(rec => {
                console.log(`   • ${rec}`);
            });
        });
        
        console.log('\n🎯 General Content Strategy:');
        console.log('• Add detailed explanations for complex topics');
        console.log('• Include step-by-step guides and tutorials');
        console.log('• Add personal stories and testimonials');
        console.log('• Include FAQ sections for common questions');
        console.log('• Add expert quotes and medical insights');
        console.log('• Include actionable tips and strategies');
        console.log('• Add related resources and links');
        
        this.recommendations = [
            'Add detailed explanations for complex topics',
            'Include step-by-step guides and tutorials',
            'Add personal stories and testimonials',
            'Include FAQ sections for common questions',
            'Add expert quotes and medical insights',
            'Include actionable tips and strategies',
            'Add related resources and links'
        ];
    }

    getRecommendationsForPage(fileName, wordCount) {
        const neededWords = 500 - wordCount;
        const recommendations = [];
        
        if (fileName.includes('index.html')) {
            recommendations.push('Add detailed FAQ section (150-200 words)');
            recommendations.push('Include user testimonials and success stories (100-150 words)');
            recommendations.push('Add comprehensive feature explanations (100-150 words)');
            recommendations.push('Include expert medical endorsements (50-100 words)');
        } else if (fileName.includes('blog.html')) {
            recommendations.push('Add detailed blog post descriptions (100-150 words)');
            recommendations.push('Include category explanations (50-100 words)');
            recommendations.push('Add author bios and credentials (50-100 words)');
            recommendations.push('Include related article suggestions (50-100 words)');
        } else {
            // Blog post
            recommendations.push('Add detailed introduction (100-150 words)');
            recommendations.push('Include step-by-step instructions (150-200 words)');
            recommendations.push('Add expert tips and advice (100-150 words)');
            recommendations.push('Include personal experiences (50-100 words)');
            recommendations.push('Add related resources and links (50-100 words)');
        }
        
        return recommendations.slice(0, Math.ceil(neededWords / 100));
    }
}

// Run the agent
const agent = new ContentLengthAuditor();
agent.auditContentLength().catch(console.error); 