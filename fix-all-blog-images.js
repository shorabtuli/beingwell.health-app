const fs = require('fs');
const path = require('path');

// Working image component to replace broken ones
const workingImageComponent = `<!-- Featured Image -->
<div class="mb-12">
  <picture>
    <source srcset="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp" type="image/webp">
    <img 
      src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=80&amp;fm=webp" 
      alt="Featured image" 
      class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg" 
      loading="lazy">
  </picture>
</div>`;

// Function to check if an image is broken or missing
function isImageBroken(imageTag) {
  if (!imageTag) return true;
  
  // Check for empty src, broken src, or malformed tags
  const hasEmptySrc = imageTag.includes('src=""') || imageTag.includes('src="#"') || imageTag.includes('src=" "');
  const hasBrokenSrc = imageTag.includes('src=" src="') || imageTag.includes('alt=" alt="');
  const hasMalformedStructure = imageTag.includes('<picture><source srcset=" src="') || imageTag.includes('alt="Featured image" class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg" loading="lazy" alt="Featured image"');
  
  return hasEmptySrc || hasBrokenSrc || hasMalformedStructure;
}

// Function to find and replace broken featured images
function fixBrokenFeaturedImages(content) {
  // Pattern to match the entire featured image section
  const featuredImagePattern = /<!-- Featured Image -->\s*<div class="mb-12">\s*<picture>.*?<\/picture>\s*<\/div>/gs;
  
  // Check if there's a broken featured image section
  const match = content.match(featuredImagePattern);
  
  if (match) {
    // Check if the matched section is broken
    if (isImageBroken(match[0])) {
      console.log('  ✅ Found broken featured image, replacing...');
      return content.replace(featuredImagePattern, workingImageComponent);
    }
  }
  
  // If no featured image section exists, add one after the header
  const headerPattern = /<\/header>/;
  if (!content.includes('<!-- Featured Image -->')) {
    console.log('  ✅ No featured image section found, adding one...');
    return content.replace(headerPattern, '</header>\n\n            ' + workingImageComponent);
  }
  
  return content;
}

// Function to fix canonical URL structure
function fixCanonicalURL(content) {
  const malformedCanonicalPattern = /<link rel="canonical" href="([^"]+)"([^>]*>)\s*<\/head><body>blog-<a href="\.\.\/blog\.html" class="text-purple-600 hover:text-purple-800 underline" onclick="trackInternalNav\('\.\.\/blog\.html'\)">posts<\/a>\/[^"]+\.html"&gt;/g;
  
  if (content.match(malformedCanonicalPattern)) {
    console.log('  ✅ Fixing malformed canonical URL structure...');
    return content.replace(malformedCanonicalPattern, '<link rel="canonical" href="$1">\n</head>\n<body>');
  }
  
  return content;
}

// Function to fix malformed headings
function fixMalformedHeadings(content) {
  // Pattern to match malformed headings like <h2arthritis="" advocacy="">Expert-Recommended Strategies for $2
  const malformedHeadingPattern = /<h2([^>]*>)([^<]*\$[0-9]+)/g;
  
  if (content.match(malformedHeadingPattern)) {
    console.log('  ✅ Fixing malformed headings...');
    return content.replace(malformedHeadingPattern, '<h2 class="text-3xl font-bold text-gray-900 mb-6">Expert-Recommended Strategies</h2>');
  }
  
  return content;
}

// Main function to process all HTML files
function fixAllBlogImages() {
  const blogPostsDir = './blog-posts';
  const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
  
  console.log(`🔍 Checking ${files.length} blog posts for broken images...`);
  
  let totalFixed = 0;
  let totalChecked = 0;
  
  files.forEach(file => {
    const filePath = path.join(blogPostsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    console.log(`\n📄 Processing: ${file}`);
    totalChecked++;
    
    // Fix canonical URL structure
    const originalContent = content;
    content = fixCanonicalURL(content);
    if (content !== originalContent) {
      hasChanges = true;
    }
    
    // Fix broken featured images
    const beforeImageFix = content;
    content = fixBrokenFeaturedImages(content);
    if (content !== beforeImageFix) {
      hasChanges = true;
    }
    
    // Fix malformed headings
    const beforeHeadingFix = content;
    content = fixMalformedHeadings(content);
    if (content !== beforeHeadingFix) {
      hasChanges = true;
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
  console.log(`   - All broken images should now be resolved!`);
}

// Run the fix
fixAllBlogImages(); 