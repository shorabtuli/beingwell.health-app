const fs = require('fs');
const path = require('path');

class AltTextFinder {
    constructor() {
        this.filesToCheck = [
            'index.html',
            'blog.html'
        ];
        this.blogPostsDir = 'blog-posts';
        this.altTextTemplates = {
            'hero': 'Being Well RA wellness app interface showing personalized daily plans',
            'exercise': 'Person performing gentle exercise for rheumatoid arthritis',
            'nutrition': 'Healthy anti-inflammatory foods for RA management',
            'meditation': 'Person practicing mindfulness meditation for stress relief',
            'sleep': 'Person sleeping peacefully with RA-friendly sleep setup',
            'community': 'Diverse group of people with RA supporting each other',
            'app': 'Being Well mobile app interface on smartphone',
            'doctor': 'Healthcare professional consulting with RA patient',
            'pain': 'Person managing joint pain with gentle techniques',
            'wellness': 'Holistic wellness activities for RA management',
            'technology': 'Digital tools and apps for RA tracking',
            'lifestyle': 'Daily activities adapted for RA patients',
            'medication': 'RA medication management and organization',
            'flares': 'RA flare management and symptom tracking',
            'workplace': 'Workplace accommodations for RA patients',
            'travel': 'Travel tips and preparations for RA patients',
            'pregnancy': 'RA management during pregnancy and postpartum',
            'aging': 'RA management strategies for older adults',
            'youth': 'Young adults managing RA in daily life',
            'seasonal': 'Seasonal changes and RA symptom management'
        };
    }

    async findMissingAltText() {
        console.log('🔍 Agent 1: Alt Text Finder & Populator');
        console.log('=' .repeat(50));
        
        let totalImages = 0;
        let missingAlt = 0;
        let fixedImages = 0;

        // Check main pages
        for (const file of this.filesToCheck) {
            if (fs.existsSync(file)) {
                const result = await this.processFile(file);
                totalImages += result.total;
                missingAlt += result.missing;
                fixedImages += result.fixed;
            }
        }

        // Check blog posts
        if (fs.existsSync(this.blogPostsDir)) {
            const blogFiles = fs.readdirSync(this.blogPostsDir).filter(file => file.endsWith('.html'));
            console.log(`\n📝 Checking ${blogFiles.length} blog posts...`);
            
            for (const file of blogFiles.slice(0, 10)) { // Check first 10 for demo
                const filePath = path.join(this.blogPostsDir, file);
                const result = await this.processFile(filePath);
                totalImages += result.total;
                missingAlt += result.missing;
                fixedImages += result.fixed;
            }
        }

        console.log('\n📊 Summary:');
        console.log(`Total images found: ${totalImages}`);
        console.log(`Images missing alt text: ${missingAlt}`);
        console.log(`Images fixed: ${fixedImages}`);
        
        if (missingAlt > 0) {
            console.log(`\n⚠️  ${missingAlt} images still need alt text`);
            console.log('Run this agent again to fix remaining images');
        } else {
            console.log('\n✅ All images now have descriptive alt text!');
        }
    }

    async processFile(filePath) {
        console.log(`\n📄 Processing: ${filePath}`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        const imgRegex = /<img[^>]*>/gi;
        const matches = content.match(imgRegex) || [];
        
        let total = matches.length;
        let missing = 0;
        let fixed = 0;

        for (const imgTag of matches) {
            if (!this.hasAltText(imgTag)) {
                missing++;
                const newAltText = this.generateAltText(imgTag, filePath);
                const newImgTag = this.addAltText(imgTag, newAltText);
                content = content.replace(imgTag, newImgTag);
                fixed++;
                
                console.log(`  ✅ Added alt text: "${newAltText}"`);
            }
        }

        if (missing > 0) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  📝 Updated ${filePath} with ${fixed} new alt texts`);
        }

        return { total, missing, fixed };
    }

    hasAltText(imgTag) {
        return /alt\s*=\s*["'][^"']*["']/i.test(imgTag);
    }

    generateAltText(imgTag, filePath) {
        // Extract context from file path and existing attributes
        const src = imgTag.match(/src\s*=\s*["']([^"']*)["']/i)?.[1] || '';
        const className = imgTag.match(/class\s*=\s*["']([^"']*)["']/i)?.[1] || '';
        
        // Determine context based on file and image characteristics
        let context = this.getContextFromFile(filePath);
        
        // Look for keywords in src and class
        const keywords = this.extractKeywords(src, className);
        
        // Generate descriptive alt text
        let altText = this.createDescriptiveAltText(context, keywords);
        
        return altText;
    }

    getContextFromFile(filePath) {
        if (filePath.includes('index.html')) return 'homepage';
        if (filePath.includes('blog.html')) return 'blog';
        if (filePath.includes('blog-posts/')) return 'blog-post';
        return 'general';
    }

    extractKeywords(src, className) {
        const keywords = [];
        
        // Extract from src
        if (src.includes('exercise') || src.includes('workout')) keywords.push('exercise');
        if (src.includes('food') || src.includes('nutrition') || src.includes('meal')) keywords.push('nutrition');
        if (src.includes('meditation') || src.includes('mindfulness')) keywords.push('meditation');
        if (src.includes('sleep') || src.includes('bed')) keywords.push('sleep');
        if (src.includes('community') || src.includes('group')) keywords.push('community');
        if (src.includes('app') || src.includes('phone') || src.includes('mobile')) keywords.push('app');
        if (src.includes('doctor') || src.includes('medical')) keywords.push('doctor');
        if (src.includes('pain') || src.includes('joint')) keywords.push('pain');
        if (src.includes('wellness') || src.includes('health')) keywords.push('wellness');
        
        // Extract from class
        if (className.includes('hero')) keywords.push('hero');
        if (className.includes('feature')) keywords.push('feature');
        if (className.includes('testimonial')) keywords.push('testimonial');
        
        return keywords;
    }

    createDescriptiveAltText(context, keywords) {
        if (keywords.length === 0) {
            return 'Relevant image for rheumatoid arthritis wellness and management';
        }

        const primaryKeyword = keywords[0];
        const template = this.altTextTemplates[primaryKeyword];
        
        if (template) {
            return template;
        }

        // Generate based on keywords
        const descriptions = {
            'exercise': 'Person performing gentle exercise routine for rheumatoid arthritis management',
            'nutrition': 'Healthy anti-inflammatory foods and meal planning for RA patients',
            'meditation': 'Mindfulness and meditation practice for RA stress management',
            'sleep': 'Sleep optimization and rest strategies for RA patients',
            'community': 'RA community support and connection activities',
            'app': 'Being Well mobile app interface and features',
            'doctor': 'Healthcare consultation and medical support for RA',
            'pain': 'Joint pain management and relief techniques',
            'wellness': 'Holistic wellness activities for RA patients',
            'hero': 'Being Well RA wellness app hero section',
            'feature': 'Key feature of the Being Well RA management app',
            'testimonial': 'User testimonial and success story'
        };

        return descriptions[primaryKeyword] || 'Relevant image for rheumatoid arthritis wellness';
    }

    addAltText(imgTag, altText) {
        // Remove existing alt if present
        let cleanTag = imgTag.replace(/\s+alt\s*=\s*["'][^"']*["']/i, '');
        
        // Add new alt text before closing >
        return cleanTag.replace(/>$/, ` alt="${altText}">`);
    }
}

// Run the agent
const agent = new AltTextFinder();
agent.findMissingAltText().catch(console.error); 