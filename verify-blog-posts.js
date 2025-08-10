const fs = require('fs');
const path = require('path');

// Function to verify all blog posts exist
function verifyBlogPosts() {
    const blogPostsDir = './blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    console.log(`🔍 Verifying ${files.length} blog posts...`);
    
    let totalVerified = 0;
    let missingFiles = [];
    
    files.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            if (stats.size > 0) {
                totalVerified++;
            } else {
                missingFiles.push(`${file} (empty file)`);
            }
        } else {
            missingFiles.push(file);
        }
    });
    
    console.log(`\n✅ Verification complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Total blog posts: ${files.length}`);
    console.log(`   - Verified: ${totalVerified}`);
    console.log(`   - Issues: ${missingFiles.length}`);
    
    if (missingFiles.length > 0) {
        console.log(`\n❌ Files with issues:`);
        missingFiles.forEach(file => {
            console.log(`   - ${file}`);
        });
    } else {
        console.log(`\n🎉 All blog posts are verified and accessible!`);
    }
}

// Run the verification
verifyBlogPosts(); 