#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to fix HTML entities and malformed tags
function fixHtmlIssues(content) {
    let hasChanges = false;
    
    // Fix HTML entities
    const htmlEntities = {
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&amp;': '&'
    };
    
    Object.entries(htmlEntities).forEach(([entity, replacement]) => {
        if (content.includes(entity)) {
            content = content.replace(new RegExp(entity, 'g'), replacement);
            hasChanges = true;
        }
    });
    
    // Fix malformed script closing tags
    const malformedScriptPattern = /}<\/script><\/head><body>&gt;/g;
    if (content.match(malformedScriptPattern)) {
        content = content.replace(malformedScriptPattern, '}\n    </script>\n    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">\n    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">\n\n    \n    <!-- Google Analytics 4 -->\n    <script async src="https://www.googletagmanager.com/gtag/js?id=G-9EXZ3HZTY6"></script>');
        hasChanges = true;
    }
    
    // Fix malformed head closing tags
    const malformedHeadPattern = /<\/head><body>Being Well\.&quot;/g;
    if (content.match(malformedHeadPattern)) {
        content = content.replace(malformedHeadPattern, '</head>\n<body>');
        hasChanges = true;
    }
    
    // Fix malformed breadcrumb links
    const malformedBreadcrumbPattern = /<a href="\.\.\/index\.html'\)">Being Well<\/a> today\.&quot;/g;
    if (content.match(malformedBreadcrumbPattern)) {
        content = content.replace(malformedBreadcrumbPattern, '<a href="../index.html" onclick="trackInternalNav(\'../index.html\')">Being Well</a> today.');
        hasChanges = true;
    }
    
    // Fix malformed keywords meta tags
    const malformedKeywordsPattern = /<meta name="keywords" content="([^"]+)&quot;/g;
    if (content.match(malformedKeywordsPattern)) {
        content = content.replace(malformedKeywordsPattern, '<meta name="keywords" content="$1">');
        hasChanges = true;
    }
    
    // Fix malformed canonical URLs
    const malformedCanonicalPattern = /<link rel="canonical" href="([^"]+)&quot;/g;
    if (content.match(malformedCanonicalPattern)) {
        content = content.replace(malformedCanonicalPattern, '<link rel="canonical" href="$1">');
        hasChanges = true;
    }
    
    // Fix malformed closing body tags
    const malformedBodyPattern = /<\/body\$1><\/body><\/html>/g;
    if (content.match(malformedBodyPattern)) {
        content = content.replace(malformedBodyPattern, '</body>\n</html>');
        hasChanges = true;
    }
    
    // Fix malformed main content tags
    const malformedMainPattern = /<main id="main-content"\$1>/g;
    if (content.match(malformedMainPattern)) {
        content = content.replace(malformedMainPattern, '<main id="main-content">');
        hasChanges = true;
    }
    
    // Fix malformed container divs
    const malformedContainerPattern = /<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"\$1>/g;
    if (content.match(malformedContainerPattern)) {
        content = content.replace(malformedContainerPattern, '<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">');
        hasChanges = true;
    }
    
    return { content, hasChanges };
}

// Main function to process all HTML files
function fixRemainingHtmlIssues() {
    const blogPostsDir = './blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    console.log(`🔍 Checking ${files.length} blog posts for remaining HTML issues...`);
    
    let totalFixed = 0;
    let totalChecked = 0;
    
    files.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if file has any HTML issues
        if (content.includes('&lt;') || content.includes('&gt;') || content.includes('&quot;') || 
            content.includes('&amp;') || content.includes('$1') || content.includes('malformed')) {
            
            console.log(`\n📄 Processing: ${file}`);
            totalChecked++;
            
            // Fix HTML issues
            const { content: updatedContent, hasChanges } = fixHtmlIssues(content);
            content = updatedContent;
            
            if (hasChanges) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`  ✅ Fixed HTML issues in ${file}`);
                totalFixed++;
            } else {
                console.log(`  ✅ No HTML issues found in ${file}`);
            }
        }
    });
    
    console.log(`\n🎉 HTML issues fix complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Checked ${totalChecked} blog posts with potential issues`);
    console.log(`   - Fixed issues in ${totalFixed} files`);
    console.log(`   - All HTML entities and malformed tags should now be resolved!`);
}

// Run the fix
fixRemainingHtmlIssues(); 