#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to find related posts based on keywords
function findRelatedPosts(currentFile, allFiles, maxRelated = 3) {
    const currentName = currentFile.replace('.html', '');
    const keywords = currentName.split('-');
    
    // Filter out the current file and find related posts
    const relatedPosts = allFiles.filter(file => {
        if (file === currentFile) return false;
        
        const fileName = file.replace('.html', '');
        const fileNameKeywords = fileName.split('-');
        
        // Check for keyword matches
        const matches = keywords.filter(keyword => 
            fileNameKeywords.some(fileKeyword => 
                fileKeyword.includes(keyword) || keyword.includes(fileKeyword)
            )
        );
        
        return matches.length >= 2; // At least 2 keyword matches
    });
    
    // If not enough related posts, add some from the same category
    if (relatedPosts.length < maxRelated) {
        const categoryPosts = allFiles.filter(file => {
            if (file === currentFile) return false;
            
            // Determine category based on current file
            if (currentName.includes('exercise') || currentName.includes('workout')) {
                return file.includes('exercise') || file.includes('workout') || file.includes('fitness');
            }
            if (currentName.includes('diet') || currentName.includes('nutrition') || currentName.includes('food')) {
                return file.includes('diet') || file.includes('nutrition') || file.includes('food') || file.includes('meal');
            }
            if (currentName.includes('sleep') || currentName.includes('bed') || currentName.includes('rest')) {
                return file.includes('sleep') || file.includes('bed') || file.includes('rest');
            }
            if (currentName.includes('mental') || currentName.includes('stress') || currentName.includes('meditation')) {
                return file.includes('mental') || file.includes('stress') || file.includes('meditation') || file.includes('anxiety');
            }
            if (currentName.includes('pain') || currentName.includes('relief') || currentName.includes('therapy')) {
                return file.includes('pain') || file.includes('relief') || file.includes('therapy');
            }
            if (currentName.includes('app') || currentName.includes('tracker') || currentName.includes('technology')) {
                return file.includes('app') || file.includes('tracker') || file.includes('technology');
            }
            
            return false;
        });
        
        // Add category posts that aren't already in relatedPosts
        categoryPosts.forEach(post => {
            if (!relatedPosts.includes(post) && relatedPosts.length < maxRelated) {
                relatedPosts.push(post);
            }
        });
    }
    
    return relatedPosts.slice(0, maxRelated);
}

// Function to generate anchor text from filename
function generateAnchorText(filename) {
    const name = filename.replace('.html', '');
    const words = name.split('-');
    
    // Take first 3-4 meaningful words
    const meaningfulWords = words.filter(word => 
        word.length > 2 && 
        !['for', 'and', 'the', 'with', 'from', 'arthritis', 'ra'].includes(word)
    );
    
    return meaningfulWords.slice(0, 3).join(' ');
}

// Function to add internal links to a blog post
function addInternalLinks(content, currentFile, allFiles) {
    const relatedPosts = findRelatedPosts(currentFile, allFiles);
    
    if (relatedPosts.length === 0) {
        return { content, hasChanges: false };
    }
    
    // Create internal links section
    let internalLinksSection = `
                <div class="bg-gray-50 rounded-xl p-6 mt-8">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Related RA Resources</h3>
                    <div class="grid md:grid-cols-2 gap-4">
`;
    
    relatedPosts.forEach(post => {
        const anchorText = generateAnchorText(post);
        const title = anchorText.charAt(0).toUpperCase() + anchorText.slice(1);
        
        internalLinksSection += `
                        <a href="${post}" class="block p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200" onclick="trackInternalNav('${post}')">
                            <h4 class="font-medium text-gray-900 mb-1">${title}</h4>
                            <p class="text-sm text-gray-600">Discover more about ${anchorText.toLowerCase()} for arthritis management</p>
                        </a>`;
    });
    
    internalLinksSection += `
                    </div>
                    <div class="mt-6 text-center">
                        <a href="../index.html" class="inline-block bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200" onclick="trackInternalNav('../index.html')">
                            Download Being Well App
                        </a>
                        <a href="../blog.html" class="inline-block bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors ml-4" onclick="trackInternalNav('../blog.html')">
                            Explore More RA Resources
                        </a>
                    </div>
                </div>`;
    
    // Find the best place to insert the internal links section
    // Look for the conclusion section or end of main content
    const conclusionPattern = /<h2[^>]*>Conclusion<\/h2>/i;
    const conclusionMatch = content.match(conclusionPattern);
    
    if (conclusionMatch) {
        // Insert before conclusion
        const conclusionIndex = content.indexOf(conclusionMatch[0]);
        const beforeConclusion = content.substring(0, conclusionIndex);
        const afterConclusion = content.substring(conclusionIndex);
        
        content = beforeConclusion + internalLinksSection + afterConclusion;
    } else {
        // Look for the end of the main article content
        const articleEndPattern = /<\/article>/;
        const articleEndMatch = content.match(articleEndPattern);
        
        if (articleEndMatch) {
            const articleEndIndex = content.indexOf(articleEndMatch[0]);
            const beforeEnd = content.substring(0, articleEndIndex);
            const afterEnd = content.substring(articleEndIndex);
            
            content = beforeEnd + internalLinksSection + afterEnd;
        } else {
            // Fallback: insert before footer
            const footerPattern = /<!-- Footer -->/;
            const footerMatch = content.match(footerPattern);
            
            if (footerMatch) {
                const footerIndex = content.indexOf(footerMatch[0]);
                const beforeFooter = content.substring(0, footerIndex);
                const afterFooter = content.substring(footerIndex);
                
                content = beforeFooter + internalLinksSection + afterFooter;
            }
        }
    }
    
    return { content, hasChanges: true };
}

// Main function to process all blog posts
function addInternalLinksToAllBlogs() {
    const blogPostsDir = './blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    console.log(`🔗 Adding internal links to ${files.length} blog posts...`);
    
    let totalUpdated = 0;
    let totalChecked = 0;
    
    files.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if internal links section already exists
        if (content.includes('Related RA Resources')) {
            console.log(`  ⏭️  Skipping ${file} (already has internal links)`);
            return;
        }
        
        console.log(`  📄 Processing: ${file}`);
        totalChecked++;
        
        // Add internal links
        const { content: updatedContent, hasChanges } = addInternalLinks(content, file, files);
        
        if (hasChanges) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`  ✅ Added internal links to ${file}`);
            totalUpdated++;
        } else {
            console.log(`  ❌ Could not add internal links to ${file}`);
        }
    });
    
    console.log(`\n🎉 Internal linking complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Processed ${totalChecked} blog posts`);
    console.log(`   - Added internal links to ${totalUpdated} files`);
    console.log(`   - Skipped ${totalChecked - totalUpdated} files (already had links)`);
    console.log(`\n🔍 Google should now discover your pages much faster!`);
    console.log(`📈 Expected results:`);
    console.log(`   - Faster indexing of remaining pages`);
    console.log(`   - Better internal link structure`);
    console.log(`   - Improved SEO and user experience`);
}

// Run the internal linking
addInternalLinksToAllBlogs(); 