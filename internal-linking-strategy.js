const fs = require('fs');
const path = require('path');

// Define the main pages and their relationships
const pageHierarchy = {
    'index.html': {
        title: 'Being Well | RA Wellness App',
        description: 'Personalized daily plans for rheumatoid arthritis',
        type: 'landing',
        relatedSections: ['features', 'how-it-works', 'community', 'blog']
    },
    'blog.html': {
        title: 'RA Wellness Blog',
        description: 'Expert tips and strategies for RA management',
        type: 'blog-listing',
        parent: 'index.html',
        relatedSections: ['featured-posts', 'categories', 'recent-articles']
    }
};

// Define blog post categories and their relationships
const blogCategories = {
    'exercise': {
        title: 'Exercise & Movement',
        description: 'Gentle exercises and movement strategies for RA',
        relatedPosts: [
            'gentle-exercise-routines-chronic-pain.html',
            'chair-exercises-arthritis-patients.html',
            'hand-arthritis-exercises-for-pain-relief.html',
            'morning-stretches-for-rheumatoid-arthritis.html',
            'water-exercises-for-rheumatoid-arthritis.html',
            'tai-chi-for-arthritis-beginners.html',
            'yoga-poses-for-arthritis-pain.html'
        ]
    },
    'nutrition': {
        title: 'Nutrition & Diet',
        description: 'Anti-inflammatory diet and nutrition strategies',
        relatedPosts: [
            'anti-inflammatory-meal-planning-autoimmune.html',
            'turmeric-recipes-for-arthritis.html',
            'ginger-recipes-arthritis-inflammation.html',
            'mediterranean-diet-arthritis.html',
            'anti-inflammatory-diet-rheumatoid-arthritis.html',
            'foods-that-reduce-arthritis-inflammation.html'
        ]
    },
    'mental-health': {
        title: 'Mental Health & Wellness',
        description: 'Stress management and emotional wellness',
        relatedPosts: [
            'mindfulness-meditation-chronic-conditions.html',
            'stress-reduction-techniques.html',
            'meditation-for-chronic-pain-relief.html',
            'breathing-exercises-stress.html',
            'anxiety-relief-arthritis.html',
            'depression-arthritis-management.html'
        ]
    },
    'sleep': {
        title: 'Sleep & Recovery',
        description: 'Sleep hygiene and recovery strategies',
        relatedPosts: [
            'sleep-hygiene-tips-chronic-fatigue.html',
            'how-to-sleep-better-with-arthritis.html',
            'sleep-positions-arthritis-pain.html',
            'sleep-environment-arthritis.html',
            'sleep-tracking-apps.html',
            'melatonin-arthritis-sleep.html'
        ]
    },
    'lifestyle': {
        title: 'Lifestyle & Daily Living',
        description: 'Daily living strategies and adaptations',
        relatedPosts: [
            'how-reduce-morning-stiffness-rheumatoid-arthritis.html',
            'workplace-accommodations-ra.html',
            'ra-pregnancy-management.html',
            'traveling-arthritis-tips.html',
            'cleaning-arthritis-safe.html',
            'driving-arthritis-safe.html'
        ]
    },
    'management': {
        title: 'RA Management',
        description: 'Comprehensive RA management strategies',
        relatedPosts: [
            'ra-management-beginners-complete-guide.html',
            'exercise-nutrition-ra-complete-guide.html',
            'ra-mental-health-support-complete-guide.html',
            'flare-up-treatment.html',
            'pain-management-apps.html',
            'medication-management-arthritis.html'
        ]
    }
};

// Function to get related posts for a specific blog post
function getRelatedPosts(postFilename) {
    const relatedPosts = [];
    
    // Find which category this post belongs to
    for (const [category, categoryData] of Object.entries(blogCategories)) {
        if (categoryData.relatedPosts.includes(postFilename)) {
            // Add other posts from the same category
            relatedPosts.push(...categoryData.relatedPosts.filter(post => post !== postFilename));
            
            // Add posts from related categories
            if (category === 'exercise') {
                relatedPosts.push(...blogCategories.nutrition.relatedPosts.slice(0, 2));
                relatedPosts.push(...blogCategories.lifestyle.relatedPosts.slice(0, 2));
            } else if (category === 'nutrition') {
                relatedPosts.push(...blogCategories.exercise.relatedPosts.slice(0, 2));
                relatedPosts.push(...blogCategories.management.relatedPosts.slice(0, 2));
            } else if (category === 'mental-health') {
                relatedPosts.push(...blogCategories.sleep.relatedPosts.slice(0, 2));
                relatedPosts.push(...blogCategories.lifestyle.relatedPosts.slice(0, 2));
            } else if (category === 'sleep') {
                relatedPosts.push(...blogCategories['mental-health'].relatedPosts.slice(0, 2));
                relatedPosts.push(...blogCategories.lifestyle.relatedPosts.slice(0, 2));
            } else if (category === 'lifestyle') {
                relatedPosts.push(...blogCategories.exercise.relatedPosts.slice(0, 2));
                relatedPosts.push(...blogCategories.management.relatedPosts.slice(0, 2));
            } else if (category === 'management') {
                relatedPosts.push(...blogCategories.exercise.relatedPosts.slice(0, 2));
                relatedPosts.push(...blogCategories.nutrition.relatedPosts.slice(0, 2));
            }
            break;
        }
    }
    
    // Remove duplicates and limit to 6 posts
    return [...new Set(relatedPosts)].slice(0, 6);
}

// Function to create internal linking HTML
function createInternalLinkingSection(postFilename, postTitle) {
    const relatedPosts = getRelatedPosts(postFilename);
    
    if (relatedPosts.length === 0) return '';
    
    const relatedPostsHTML = relatedPosts.map(post => {
        const postName = post.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `<li><a href="${post}" class="text-blue-600 hover:text-blue-800 underline">${postName}</a></li>`;
    }).join('');
    
    return `
    <!-- Related Articles Section -->
    <section class="py-12 bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Related Articles</h2>
                <p class="text-gray-600">Discover more strategies for managing your rheumatoid arthritis</p>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-6">
                <ul class="space-y-3">
                    ${relatedPostsHTML}
                </ul>
                <div class="mt-6 text-center">
                    <a href="../blog.html" class="text-purple-600 hover:text-purple-800 font-semibold">
                        ← Back to All Articles
                    </a>
                </div>
            </div>
        </div>
    </section>
    `;
}

// Function to add navigation breadcrumbs
function createBreadcrumbs(currentPage, parentPage = null) {
    let breadcrumbs = '<nav class="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">';
    breadcrumbs += '<ol class="flex items-center space-x-2">';
    breadcrumbs += '<li><a href="../index.html" class="hover:text-purple-600">Home</a></li>';
    
    if (parentPage) {
        breadcrumbs += '<li><span class="mx-2">/</span></li>';
        breadcrumbs += `<li><a href="../${parentPage}" class="hover:text-purple-600">Blog</a></li>`;
    }
    
    breadcrumbs += '<li><span class="mx-2">/</span></li>';
    breadcrumbs += `<li class="text-gray-900">${currentPage}</li>`;
    breadcrumbs += '</ol></nav>';
    
    return breadcrumbs;
}

// Function to add main page navigation links
function createMainPageNavigation() {
    return `
    <!-- Main Navigation Links -->
    <div class="bg-white border-t border-gray-200 py-8 mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Being Well App</h3>
                    <ul class="space-y-2">
                        <li><a href="../index.html" class="text-gray-600 hover:text-purple-600">Home</a></li>
                        <li><a href="../index.html#features" class="text-gray-600 hover:text-purple-600">Features</a></li>
                        <li><a href="../index.html#how-it-works" class="text-gray-600 hover:text-purple-600">How It Works</a></li>
                        <li><a href="../index.html#download" class="text-gray-600 hover:text-purple-600">Download App</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Blog Categories</h3>
                    <ul class="space-y-2">
                        <li><a href="../blog.html#exercise" class="text-gray-600 hover:text-purple-600">Exercise & Movement</a></li>
                        <li><a href="../blog.html#nutrition" class="text-gray-600 hover:text-purple-600">Nutrition & Diet</a></li>
                        <li><a href="../blog.html#mental-health" class="text-gray-600 hover:text-purple-600">Mental Health</a></li>
                        <li><a href="../blog.html#sleep" class="text-gray-600 hover:text-purple-600">Sleep & Recovery</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">RA Management</h3>
                    <ul class="space-y-2">
                        <li><a href="ra-management-beginners-complete-guide.html" class="text-gray-600 hover:text-purple-600">Beginner's Guide</a></li>
                        <li><a href="exercise-nutrition-ra-complete-guide.html" class="text-gray-600 hover:text-purple-600">Exercise & Nutrition</a></li>
                        <li><a href="ra-mental-health-support-complete-guide.html" class="text-gray-600 hover:text-purple-600">Mental Health Support</a></li>
                        <li><a href="workplace-accommodations-ra.html" class="text-gray-600 hover:text-purple-600">Workplace Accommodations</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
                    <ul class="space-y-2">
                        <li><a href="../blog.html" class="text-gray-600 hover:text-purple-600">All Articles</a></li>
                        <li><a href="how-reduce-morning-stiffness-rheumatoid-arthritis.html" class="text-gray-600 hover:text-purple-600">Morning Stiffness</a></li>
                        <li><a href="chair-exercises-arthritis-patients.html" class="text-gray-600 hover:text-purple-600">Chair Exercises</a></li>
                        <li><a href="anti-inflammatory-meal-planning-autoimmune.html" class="text-gray-600 hover:text-purple-600">Meal Planning</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    `;
}

// Function to process blog posts and add internal linking
function processBlogPosts() {
    const blogPostsDir = 'blog-posts';
    const files = fs.readdirSync(blogPostsDir).filter(file => file.endsWith('.html'));
    
    let processedFiles = 0;
    
    files.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if internal linking already exists
        if (content.includes('Related Articles Section')) {
            console.log(`⏭️  Skipping ${file} - already has internal linking`);
            return;
        }
        
        // Add breadcrumbs after the header
        const breadcrumbs = createBreadcrumbs(file.replace('.html', ''), 'blog.html');
        content = content.replace(
            /<main[^>]*>/,
            `<main$1>${breadcrumbs}`
        );
        
        // Add related articles section before closing main tag
        const relatedSection = createInternalLinkingSection(file, file.replace('.html', ''));
        content = content.replace(
            /<\/main>/,
            `${relatedSection}</main>`
        );
        
        // Add main page navigation before closing body tag
        const mainNav = createMainPageNavigation();
        content = content.replace(
            /<\/body>/,
            `${mainNav}</body>`
        );
        
        // Add internal links within content (strategic placement)
        const postTitle = file.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        // Add links to main app page (more specific to avoid over-linking)
        content = content.replace(
            /(Being Well RA wellness app)/gi,
            '<a href="../index.html" class="text-purple-600 hover:text-purple-800 underline">$1</a>'
        );
        
        // Add links to blog listing (more specific)
        content = content.replace(
            /(RA wellness blog|expert articles|helpful posts)/gi,
            '<a href="../blog.html" class="text-purple-600 hover:text-purple-800 underline">$1</a>'
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        processedFiles++;
        console.log(`✅ Updated ${file} with internal linking`);
    });
    
    return processedFiles;
}

// Function to update main pages with enhanced internal linking
function updateMainPages() {
    // Update index.html with better blog linking
    let indexContent = fs.readFileSync('index.html', 'utf8');
    
    // Add more specific links to blog posts
    const blogLinks = `
    <!-- Enhanced Blog Links -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <a href="blog-posts/how-reduce-morning-stiffness-rheumatoid-arthritis.html" class="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h4 class="font-semibold text-gray-900 mb-2">Morning Stiffness Relief</h4>
            <p class="text-sm text-gray-600">Proven techniques to reduce morning stiffness</p>
        </a>
        <a href="blog-posts/chair-exercises-arthritis-patients.html" class="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h4 class="font-semibold text-gray-900 mb-2">Chair Exercises</h4>
            <p class="text-sm text-gray-600">Safe seated exercises for RA patients</p>
        </a>
        <a href="blog-posts/anti-inflammatory-meal-planning-autoimmune.html" class="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h4 class="font-semibold text-gray-900 mb-2">Anti-Inflammatory Meals</h4>
            <p class="text-sm text-gray-600">Meal planning for autoimmune conditions</p>
        </a>
    </div>
    `;
    
    // Add the blog links section
    indexContent = indexContent.replace(
        /<a href="blog\.html" class="text-purple-600 hover:text-purple-800 font-semibold">/,
        `${blogLinks}<a href="blog.html" class="text-purple-600 hover:text-purple-800 font-semibold">`
    );
    
    fs.writeFileSync('index.html', indexContent, 'utf8');
    console.log('✅ Updated index.html with enhanced blog linking');
    
    // Update blog.html with category navigation
    let blogContent = fs.readFileSync('blog.html', 'utf8');
    
    // Add category navigation
    const categoryNav = `
    <!-- Category Navigation -->
    <div class="bg-white border-b border-gray-200 py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-wrap gap-4 justify-center">
                <a href="#exercise" class="px-4 py-2 bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 transition-colors">Exercise & Movement</a>
                <a href="#nutrition" class="px-4 py-2 bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors">Nutrition & Diet</a>
                <a href="#mental-health" class="px-4 py-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors">Mental Health</a>
                <a href="#sleep" class="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full hover:bg-indigo-200 transition-colors">Sleep & Recovery</a>
                <a href="#lifestyle" class="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors">Lifestyle</a>
                <a href="#management" class="px-4 py-2 bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors">RA Management</a>
            </div>
        </div>
    </div>
    `;
    
    // Add category navigation after hero section
    blogContent = blogContent.replace(
        /<\/section>\s*<!-- Comprehensive RA Management Guide -->/,
        `</section>${categoryNav}<!-- Comprehensive RA Management Guide -->`
    );
    
    fs.writeFileSync('blog.html', blogContent, 'utf8');
    console.log('✅ Updated blog.html with category navigation');
}

// Main execution
console.log('🚀 Starting internal linking implementation...\n');

try {
    const processedFiles = processBlogPosts();
    updateMainPages();
    
    console.log(`\n📊 Summary:`);
    console.log(`- Processed ${processedFiles} blog posts`);
    console.log(`- Added breadcrumb navigation`);
    console.log(`- Added related articles sections`);
    console.log(`- Added main page navigation`);
    console.log(`- Enhanced main pages with better linking`);
    
    console.log('\n🎯 Internal Linking Features:');
    console.log('- Breadcrumb navigation for easy navigation');
    console.log('- Related articles sections on each blog post');
    console.log('- Category navigation on blog listing page');
    console.log('- Strategic links to main app page');
    console.log('- Cross-linking between related content');
    
    console.log('\n✨ Internal linking implementation complete!');
    console.log('📈 SEO benefits:');
    console.log('- Improved page authority distribution');
    console.log('- Better user navigation and engagement');
    console.log('- Enhanced search engine crawling');
    console.log('- Reduced bounce rates');
    
} catch (error) {
    console.error('❌ Error during implementation:', error.message);
} 