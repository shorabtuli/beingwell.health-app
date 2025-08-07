const fs = require('fs');
const path = require('path');

// Function to fix ALL broken content across all blog posts
function fixAllBrokenContent() {
    const blogPostsDir = './blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));

    console.log(`🔍 Checking ${files.length} blog posts for broken content...`);

    let totalFixed = 0;
    let totalChecked = 0;

    files.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;

        console.log(`\n📄 Processing: ${file}`);
        totalChecked++;

        // 1. Fix malformed canonical URLs
        const malformedCanonicalPattern = /<link rel="canonical" href="([^"]+)"([^>]*>)/g;
        const fixedCanonicalPattern = '<link rel="canonical" href="$1">';

        if (content.match(malformedCanonicalPattern)) {
            content = content.replace(malformedCanonicalPattern, fixedCanonicalPattern);
            hasChanges = true;
            console.log(`  ✅ Fixed malformed canonical URL`);
        }

        // 2. Fix broken script closing tags
        const brokenScriptPattern = /}<\/script>&gt;/g;
        const fixedScriptPattern = '}</script>';

        if (content.match(brokenScriptPattern)) {
            content = content.replace(brokenScriptPattern, fixedScriptPattern);
            hasChanges = true;
            console.log(`  ✅ Fixed broken script closing tag`);
        }

        // 3. Fix malformed featured images (multiple patterns)
        const brokenImagePatterns = [
            // Pattern 1: Malformed picture tags with broken srcset
            {
                pattern: /<picture><source srcset=" src="([^"]+)" type="image\/webp"><img src="([^"]+)" alt="([^"]+)" class="([^"]+)" loading="lazy"><\/picture>/g,
                replacement: '<picture>\n                    <source srcset="$1" type="image/webp">\n                    <img src="$2" \n                         alt="$3" \n                         class="$4" \n                         loading="lazy">\n                </picture>'
            },
            // Pattern 2: Picture tags with escaped quotes
            {
                pattern: /<picture><source srcset="([^"]+)" type="image\/webp"><img src="([^"]+)" alt="([^"]+)" class="([^"]+)" loading="lazy"><\/picture>/g,
                replacement: '<picture>\n                    <source srcset="$1" type="image/webp">\n                    <img src="$2" \n                         alt="$3" \n                         class="$4" \n                         loading="lazy">\n                </picture>'
            },
            // Pattern 3: Specific malformed image patterns
            {
                pattern: /<picture><source srcset=" src="([^"]+)" type="image\/webp"><img src="([^"]+)" alt="([^"]+)" class="([^"]+)" loading="lazy"([^>]+)="" class="([^"]+)" loading="lazy"><\/picture>/g,
                replacement: '<picture>\n                    <source srcset="$1" type="image/webp">\n                    <img src="$2" \n                         alt="$3" \n                         class="$4" \n                         loading="lazy">\n                </picture>'
            }
        ];

        brokenImagePatterns.forEach(({ pattern, replacement }) => {
            if (content.match(pattern)) {
                content = content.replace(pattern, replacement);
                hasChanges = true;
                console.log(`  ✅ Fixed malformed featured image`);
            }
        });

        // 4. Fix broken image URLs
        const brokenUrlPattern = /https:\/\/images\.unsplash\.com\/ photo-([^"]+)/g;
        const fixedUrlPattern = 'https://images.unsplash.com/photo-$1';

        if (content.match(brokenUrlPattern)) {
            content = content.replace(brokenUrlPattern, fixedUrlPattern);
            hasChanges = true;
            console.log(`  ✅ Fixed broken image URLs`);
        }

        // 5. Fix malformed headings
        const malformedHeadingPattern = /<h2([^>]*>)([^<]*\$[0-9]+)/g;
        const fixedHeadingPattern = '<h2$1$2';

        if (content.match(malformedHeadingPattern)) {
            content = content.replace(malformedHeadingPattern, fixedHeadingPattern);
            hasChanges = true;
            console.log(`  ✅ Fixed malformed headings`);
        }

        // 6. Fix specific broken headings with placeholders
        const specificHeadingPatterns = [
            {
                pattern: /<h2acupuncture arthritis="" pain="">Expert-Recommended Strategies for \$2/g,
                replacement: '<h2 class="text-3xl font-bold text-gray-900 mb-6">Expert-Recommended Strategies for Acupuncture Arthritis Pain</h2>'
            },
            {
                pattern: /<h2acupuncture arthritis="">Expert-Recommended Strategies for \$2/g,
                replacement: '<h2 class="text-3xl font-bold text-gray-900 mb-6">Expert-Recommended Strategies for Acupuncture Arthritis</h2>'
            },
            {
                pattern: /<h2active rest="" arthritis="">Ready to Try Expert-Recommended \$2 Strategies?/g,
                replacement: '<h2 class="text-3xl font-bold text-gray-900 mb-6">Ready to Try Expert-Recommended Active Rest Arthritis Strategies?</h2>'
            }
        ];

        specificHeadingPatterns.forEach(({ pattern, replacement }) => {
            if (content.match(pattern)) {
                content = content.replace(pattern, replacement);
                hasChanges = true;
                console.log(`  ✅ Fixed specific malformed heading`);
            }
        });

        // 7. Fix malformed footer links
        const malformedFooterPatterns = [
            // Pattern 1: Blog Categories with broken HTML
            {
                pattern: /<h3 class="text-lg font-semibold text-gray-900 mb-4"><a href="\.\.\/blog\.html" class="text-purple-600 hover:text-purple-800 underline" onclick="trackInternalNav\('\.\.\/blog\.html'\)">Blog<\/a> Categories<\/h3>\s*<ul class="space-y-2">\s*<li><a href="\.\.\/<a href=" \.\.="" blog\.html"="" class="text-purple-600 hover:text-purple-800 underline" onclick="trackInternalNav\('\.\.\/blog\.html'\)">blog<\/a>\.html#exercise" class="text-gray-600 hover:text-purple-600"&gt;Exercise & Movement<\/li>\s*<li><a href="\.\.\/<a href=" \.\.="" blog\.html"="" class="text-purple-600 hover:text-purple-800 underline" onclick="trackInternalNav\('\.\.\/blog\.html'\)">blog<\/a>\.html#nutrition" class="text-gray-600 hover:text-purple-600"&gt;Nutrition & Diet<\/li>\s*<li><a href="\.\.\/<a href=" \.\.="" blog\.html"="" class="text-purple-600 hover:text-purple-800 underline" onclick="trackInternalNav\('\.\.\/blog\.html'\)">blog<\/a>\.html#mental-health" class="text-gray-600 hover:text-purple-600"&gt;Mental Health<\/li>\s*<li><a href="\.\.\/<a href=" \.\.="" blog\.html"="" class="text-purple-600 hover:text-purple-800 underline" onclick="trackInternalNav\('\.\.\/blog\.html'\)">blog<\/a>\.html#sleep" class="text-gray-600 hover:text-purple-600"&gt;Sleep & Recovery<\/li>\s*<\/ul>/g,
                replacement: '<h3 class="text-lg font-semibold text-gray-900 mb-4">Blog Categories</h3>\n                    <ul class="space-y-2">\n                        <li><a href="../blog.html#exercise" class="text-gray-600 hover:text-purple-600">Exercise & Movement</a></li>\n                        <li><a href="../blog.html#nutrition" class="text-gray-600 hover:text-purple-600">Nutrition & Diet</a></li>\n                        <li><a href="../blog.html#mental-health" class="text-gray-600 hover:text-purple-600">Mental Health</a></li>\n                        <li><a href="../blog.html#sleep" class="text-gray-600 hover:text-purple-600">Sleep & Recovery</a></li>\n                    </ul>'
            },
            // Pattern 2: Resources with broken HTML
            {
                pattern: /<li><a href="\.\.\/<a href=" \.\.="" blog\.html"="" class="text-purple-600 hover:text-purple-800 underline" onclick="trackInternalNav\('\.\.\/blog\.html'\)">blog<\/a>\.html" class="text-gray-600 hover:text-purple-600"&gt;All <a href="\.\.\/blog\.html" class="text-purple-600 hover:text-purple-800 underline" onclick="trackInternalNav\('\.\.\/blog\.html'\)">Articles<\/a><\/li>/g,
                replacement: '<li><a href="../blog.html" class="text-gray-600 hover:text-purple-600">All Articles</a></li>'
            }
        ];

        malformedFooterPatterns.forEach(({ pattern, replacement }) => {
            if (content.match(pattern)) {
                content = content.replace(pattern, replacement);
                hasChanges = true;
                console.log(`  ✅ Fixed malformed footer links`);
            }
        });

        // 8. Remove duplicate footer sections
        const footerSections = content.match(/<!-- Main Navigation Links -->/g);
        if (footerSections && footerSections.length > 1) {
            // Keep only the first footer section, remove all others
            const firstFooterIndex = content.indexOf('<!-- Main Navigation Links -->');
            const secondFooterIndex = content.indexOf('<!-- Main Navigation Links -->', firstFooterIndex + 1);
            
            if (secondFooterIndex !== -1) {
                content = content.substring(0, secondFooterIndex);
                hasChanges = true;
                console.log(`  ✅ Removed duplicate footer sections`);
            }
        }

        // 9. Fix malformed closing tags
        const malformedClosingPattern = /<\/body\$1><\/body><\/html>/g;
        const fixedClosingPattern = '</body>\n</html>';

        if (content.match(malformedClosingPattern)) {
            content = content.replace(malformedClosingPattern, fixedClosingPattern);
            hasChanges = true;
            console.log(`  ✅ Fixed malformed closing tags`);
        }

        // 10. Fix escaped HTML entities
        const escapedEntitiesPattern = /&quot;/g;
        if (content.match(escapedEntitiesPattern)) {
            content = content.replace(escapedEntitiesPattern, '"');
            hasChanges = true;
            console.log(`  ✅ Fixed escaped HTML entities`);
        }

        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  ✅ Fixed issues in ${file}`);
            totalFixed++;
        } else {
            console.log(`  ✅ No issues found in ${file}`);
        }
    });

    console.log(`\n🎉 Comprehensive fix complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Checked ${totalChecked} blog posts`);
    console.log(`   - Fixed issues in ${totalFixed} files`);
    console.log(`   - All broken images and footers should now be resolved!`);
}

// Run the comprehensive fix
fixAllBrokenContent(); 