const fs = require('fs');
const path = require('path');

// List of specific blog posts to check and fix
const targetBlogs = [
    'active-lifestyle-arthritis.html',
    'active-rest-arthritis.html',
    'acupressure-points-for-arthritis.html',
    'acupuncture-arthritis-pain.html',
    'acupuncture-arthritis.html',
    'acute-arthritis-pain.html',
    'advancement-arthritis.html',
    'age-related-arthritis.html',
    'age-specific-arthritis.html',
    'aging-arthritis.html',
    'air-conditioning-arthritis.html',
    'air-quality-arthritis.html',
    'ankle-arthritis-exercises-gentle.html',
    'ankylosing-spondylitis.html',
    'anti-inflammatory-diet-rheumatoid-arthritis.html',
    'anti-inflammatory-meal-planning-autoimmune.html',
    'anti-inflammatory-meal-prep.html',
    'anxiety-relief-arthritis.html',
    'appointment-tracking.html',
    'arm-exercises-arthritis-safe.html',
    'art-therapy-arthritis.html',
    'arthritis-accident-prevention.html',
    'arthritis-accommodation-rights.html',
    'arthritis-advocacy-legal.html',
    'arthritis-advocacy.html',
    'arthritis-aging-process.html',
    'arthritis-aid.html',
    'arthritis-app-alternatives.html',
    'arthritis-app-cost-comparison.html',
    'arthritis-app-download-comparison.html',
    'arthritis-app-features-comparison.html',
    'arthritis-app-ratings.html',
    'arthritis-app-reviews-2024.html',
    'arthritis-app-subscription.html',
    'arthritis-assistance.html',
    'arthritis-awareness.html',
    'arthritis-bathroom-safety.html',
    'arthritis-bedroom-setup.html',
    'arthritis-budget-planning.html',
    'arthritis-civil-rights.html',
    'arthritis-clothing-adaptations.html',
    'arthritis-community-app-comparison.html',
    'arthritis-community.html',
    'arthritis-companionship.html',
    'arthritis-connections.html',
    'arthritis-cost-management.html',
    'arthritis-counseling.html',
    'arthritis-crisis-management.html',
    'arthritis-diet-app-comparison.html',
    'arthritis-diet-meal-planning.html',
    'arthritis-different-ages.html',
    'arthritis-disability-benefits.html',
    'arthritis-disability-rights.html',
    'arthritis-discrimination.html',
    'arthritis-education.html',
    'arthritis-emergency-plan.html',
    'arthritis-employment-law.html',
    'arthritis-family.html',
    'arthritis-financial-assistance.html',
    'arthritis-financial-planning.html',
    'arthritis-flare-emergency.html',
    'arthritis-flare-up-app-reviews.html',
    'arthritis-friends.html',
    'arthritis-guidance.html',
    'arthritis-healthcare-costs.html',
    'arthritis-help.html',
    'arthritis-home-modifications.html',
    'arthritis-indoor-environment.html',
    'arthritis-information.html',
    'arthritis-insurance-claims.html',
    'arthritis-insurance-coverage.html',
    'arthritis-kitchen-modifications.html',
    'arthritis-legal-assistance.html',
    'arthritis-legal-protection.html',
    'arthritis-life-satisfaction.html',
    'arthritis-living-room.html',
    'arthritis-medical-costs.html',
    'arthritis-medical-expenses.html',
    'arthritis-medication-tracker-app.html',
    'arthritis-meditation-app-reviews.html',
    'arthritis-network.html',
    'arthritis-online-community.html',
    'arthritis-online-support.html',
    'arthritis-outdoor-space.html',
    'arthritis-pain-crisis.html',
    'arthritis-pain-tracking-app-comparison.html',
    'arthritis-personal-development.html',
    'arthritis-quality-of-life.html',
    'arthritis-relationships.html',
    'arthritis-resources.html',
    'arthritis-rights-protection.html',
    'arthritis-safety-equipment.html',
    'arthritis-safety-guidelines.html',
    'arthritis-safety-tips.html',
    'arthritis-sleep-tracking-app.html',
    'arthritis-social-media.html',
    'arthritis-social.html',
    'arthritis-success-stories.html',
    'arthritis-support-groups.html',
    'arthritis-support.html',
    'arthritis-tracking-apps.html',
    'arthritis-vehicle-modifications.html',
    'arthritis-webinars.html',
    'arthritis-wellness-app-comparison.html',
    'arthritis-workplace-changes.html',
    'arthritis-workplace-rights.html',
    'aspirations-arthritis.html',
    'athletes-arthritis.html',
    'autoimmune-arthritis.html',
    'ayurveda-arthritis.html',
    'back-arthritis-pain-management.html',
    'back-strengthening-arthritis.html',
    'barometric-pressure-arthritis.html',
    'batch-cooking-arthritis-diet.html',
    'bedroom-temperature-arthritis.html',
    'bedtime-routine-arthritis.html',
    'being-well-vs-apple-health-arthritis.html',
    'being-well-vs-arthritis-care.html',
    'being-well-vs-arthritis-foundation-app.html',
    'being-well-vs-arthritis-helper.html',
    'being-well-vs-arthritis-support.html',
    'being-well-vs-arthritis-tracker.html',
    'being-well-vs-calm-arthritis.html',
    'being-well-vs-creakyjoints-app.html',
    'being-well-vs-fitbit-arthritis.html',
    'being-well-vs-google-fit-arthritis.html',
    'being-well-vs-headspace-chronic-pain.html',
    'being-well-vs-joint-health-app.html',
    'being-well-vs-lose-it-arthritis.html',
    'being-well-vs-myfitnesspal-arthritis.html',
    'being-well-vs-myra-app.html',
    'being-well-vs-noom-arthritis.html',
    'being-well-vs-ra-management.html',
    'being-well-vs-ra-warrior.html',
    'being-well-vs-strava-arthritis.html',
    'being-well-vs-weight-watchers-arthritis.html',
    'berries-anti-inflammatory-arthritis.html',
    'best-arthritis-apps-ios.html',
    'best-arthritis-symptom-tracker-app.html',
    'best-exercises-for-morning-arthritis-pain.html',
    'blog-post-1.html',
    'blog-post-2.html',
    'blog-post-3.html',
    'blog-post-4.html',
    'blog-post-5.html',
    'blog-post-6.html',
    'blog-post-7.html',
    'bodyweight-exercises-arthritis.html',
    'breathing-exercises-for-pain-management.html',
    'breathing-exercises-stress.html',
    'career-arthritis-management.html',
    'caregiver-support-arthritis.html',
    'caregivers-arthritis.html',
    'chair-exercises-arthritis-patients.html',
    'chair-exercises-for-arthritis-patients.html',
    'chiropractic-arthritis.html',
    'cleaning-arthritis-safe.html',
    'climate-arthritis-impact.html',
    'climate-control-arthritis.html',
    'cold-therapy-arthritis-pain.html',
    'cold-weather-arthritis.html',
    'community-support-chronic-illness-diet-beginners.html',
    'comorbidity-management-ra-diabetes-heart-disease.html',
    'complementary-therapy-arthritis.html',
    'cooking-arthritis-friendly.html',
    'coping-skills-arthritis.html',
    'coping-with-arthritis-pain.html',
    'core-exercises-arthritis-friendly.html',
    'crafts-arthritis-gentle.html',
    'creative-activities-arthritis.html',
    'crisis-arthritis-management.html',
    'daily-routine-arthritis.html',
    'dairy-free-diet-arthritis.html',
    'data-sharing-doctor.html',
    'depression-arthritis-management.html',
    'desk-exercises-arthritis.html',
    'development-arthritis.html',
    'digital-arthritis-resources.html',
    'digital-arthritis-support.html',
    'digital-health-arthritis.html',
    'doctor-appointment-preparation.html',
    'driving-arthritis-safe.html',
    'education-arthritis.html',
    'elbow-arthritis-pain-relief.html',
    'elderly-arthritis-care.html',
    'elimination-diet-arthritis.html',
    'elliptical-machine-arthritis-safe.html',
    'emergency-arthritis-care.html',
    'emergency-arthritis-relief.html',
    'emotional-support-arthritis.html',
    'emotional-wellness-arthritis.html',
    'environmental-factors-arthritis.html',
    'ergonomic-workspace-arthritis.html',
    'essential-oils-for-arthritis-pain.html',
    'evening-routine-arthritis.html',
    'evening-stretches-arthritis.html',
    'evolution-arthritis.html',
    'exercise-apps-arthritis.html',
    'exercise-nutrition-ra-complete-guide.html',
    'fall-arthritis-preparation.html',
    'fall-prevention-arthritis.html',
    'family-support-arthritis.html',
    'female-arthritis.html',
    'fibromyalgia-arthritis.html',
    'finding-support-communities-chronic-illness.html',
    'fish-recipes-arthritis-inflammation.html',
    'fitness-apps-arthritis.html',
    'fitness-trackers-arthritis.html',
    'flare-up-emergency.html',
    'flare-up-tracking.html',
    'flare-up-treatment.html',
    'flexibility-exercises-arthritis-safe.html',
    'flexibility-training-arthritis.html',
    'foods-that-reduce-arthritis-inflammation.html',
    'foot-arthritis-pain-relief-methods.html',
    'free-arthritis-apps.html',
    'freezer-meals-arthritis-friendly.html',
    'fulfillment-arthritis.html',
    'games-arthritis-friendly.html',
    'gardening-arthritis-gentle.html',
    'gender-arthritis-differences.html',
    'generational-arthritis.html',
    'gentle-exercise-routines-chronic-pain.html',
    'gentle-massage-for-arthritis-pain.html',
    'gentle-recovery-exercises.html',
    'gentle-stretching-arthritis-morning.html',
    'gentle-walking-for-arthritis.html',
    'ginger-recipes-arthritis-inflammation.html',
    'gluten-free-diet-arthritis.html',
    'green-leafy-vegetables-arthritis.html',
    'growth-arthritis.html',
    'guided-meditation-arthritis.html',
    'hand-arthritis-exercises-for-pain-relief.html',
    'hand-arthritis-exercises-pain-relief.html',
    'happiness-arthritis.html',
    'health-journal-arthritis.html',
    'health-monitoring-apps.html',
    'health-monitors-arthritis.html',
    'health-technology-arthritis.html',
    'healthy-habits-chronic-illness.html',
    'heat-therapy-for-ra-pain-relief.html',
    'heating-arthritis-comfort.html',
    'herbal-medicine-arthritis.html',
    'herbal-remedies-arthritis.html',
    'hip-arthritis-pain-management.html',
    'hobbies-arthritis-friendly.html',
    'holiday-arthritis-stress.html',
    'holistic-arthritis.html',
    'holistic-wellness-ra-tips-beginners.html',
    'homeopathy-arthritis.html',
    'hormonal-arthritis.html',
    'household-chores-arthritis.html',
    'how-reduce-morning-stiffness-rheumatoid-arthritis.html',
    'how-to-get-out-of-bed-with-ra-pain.html',
    'how-to-reduce-morning-joint-stiffness.html',
    'how-to-reduce-morning-stiffness-rheumatoid-arthritis.html',
    'how-to-sleep-better-with-arthritis.html',
    'humidity-arthritis-pain.html',
    'humidity-control-arthritis.html',
    'hydration-for-ra-inflammation-beginner-guide.html',
    'improvement-arthritis.html',
    'independence-arthritis.html',
    'indoor-activities-arthritis.html',
    'indoor-climate-arthritis.html',
    'inflammatory-arthritis.html',
    'injury-prevention-arthritis.html',
    'insomnia-arthritis-pain.html',
    'instant-pot-arthritis-recipes.html',
    'job-modifications-arthritis.html',
    'joint-mobility-exercises-ra.html',
    'joint-mobility-routine-arthritis.html',
    'journaling-ra-mental-health-complete-guide.html',
    'joy-arthritis.html',
    'juvenile-arthritis-care.html',
    'keto-diet-arthritis-safe.html',
    'knee-arthritis-pain-management-techniques.html',
    'learning-arthritis.html',
    'leg-exercises-arthritis-gentle.html',
    'life-goals-arthritis.html',
    'life-satisfaction-arthritis.html',
    'lifestyle-apps-arthritis.html',
    'light-weights-arthritis-exercise.html',
    'living-well-arthritis.html',
    'low-carb-diet-arthritis.html',
    'lupus-arthritis.html',
    'male-arthritis.html',
    'massage-arthritis-relief.html',
    'massage-therapy-arthritis.html',
    'mattress-for-arthritis-pain.html',
    'meal-prep-arthritis-friendly.html',
    'meaning-arthritis.html',
    'medical-history-arthritis.html',
    'medical-records-arthritis.html',
    'medication-log-arthritis.html',
    'medication-management-arthritis.html',
    'meditation-apps-arthritis.html',
    'meditation-for-chronic-pain-relief.html',
    'meditation-for-ra-pain-complete-guide.html',
    'meditation-techniques-arthritis.html',
    'mediterranean-diet-arthritis.html',
    'melatonin-arthritis-sleep.html',
    'men-arthritis-care.html',
    'menopause-arthritis.html',
    'mens-arthritis.html',
    'mental-health-arthritis.html',
    'mental-health-resources-arthritis.html',
    'middle-age-arthritis.html',
    'mindfulness-arthritis-pain.html',
    'mindfulness-meditation-chronic-conditions.html',
    'mobile-health-arthritis.html',
    'mobility-exercises-arthritis-daily.html',
    'morning-arthritis-pain-relief.html',
    'morning-pain-management-ra.html',
    'morning-routine-arthritis.html',
    'morning-routine-for-ra-stiffness.html',
    'morning-stiffness-relief-techniques.html',
    'morning-stretches-for-rheumatoid-arthritis.html',
    'muscle-building-arthritis-safe.html',
    'music-therapy-arthritis.html',
    'napping-arthritis-patients.html',
    'natural-arthritis.html',
    'naturopathic-arthritis.html',
    'neck-arthritis-exercises-safe.html',
    'nutrition-apps-arthritis.html',
    'nuts-and-seeds-arthritis-diet.html',
    'occupational-therapy-arthritis.html',
    'office-exercises-arthritis.html',
    'olive-oil-arthritis-benefits.html',
    'omega-3-foods-arthritis.html',
    'one-pot-meals-arthritis-friendly.html',
    'online-arthritis-education.html',
    'online-arthritis-tools.html',
    'osteoarthritis-ra.html',
    'outdoor-activities-arthritis.html',
    'outdoor-climate-arthritis.html',
    'paid-arthritis-apps.html',
    'pain-management-apps.html',
    'pain-tracking-arthritis.html',
    'paleo-diet-arthritis.html',
    'parents-arthritis.html',
    'peer-support-arthritis.html',
    'personal-growth-arthritis.html',
    'photography-arthritis.html',
    'physical-therapy-arthritis.html',
    'pilates-for-arthritis-patients.html',
    'pillows-for-arthritis-neck.html',
    'plant-based-diet-arthritis.html',
    'pregnancy-arthritis.html',
    'prevention-arthritis-injury.html',
    'professional-development-arthritis.html',
    'professionals-arthritis.html',
    'progress-arthritis.html',
    'progress-monitoring-arthritis.html',
    'progressive-muscle-relaxation-arthritis.html',
    'progressive-relaxation-arthritis.html',
    'psoriatic-arthritis-management.html',
    'psychological-support-arthritis.html',
    'purpose-arthritis.html',
    'puzzles-arthritis.html',
    'quality-of-life-arthritis.html',
    'quick-meals-arthritis-friendly.html',
    'ra-exercise-app-reviews.html',
    'ra-flare-management-complete-guide.html',
    'ra-management-beginners-complete-guide.html',
    'ra-mental-health-support-complete-guide.html',
    'ra-pregnancy-management.html',
    'range-of-motion-exercises-arthritis.html',
    'raw-food-diet-arthritis.html',
    'reactive-arthritis.html',
    'reading-arthritis-comfortable.html',
    'recovery-meditation-arthritis.html',
    'recovery-nutrition-arthritis.html',
    'recovery-sleep-arthritis.html',
    'recovery-stretching-arthritis.html',
    'recovery-techniques-arthritis.html',
    'relationships-arthritis.html',
    'remote-monitoring-arthritis.html',
    'resistance-bands-arthritis-safe.html',
    'rest-days-arthritis-exercise.html',
    'rest-periods-arthritis.html',
    'restless-leg-syndrome-arthritis.html',
    'restorative-yoga-arthritis.html',
    'retirees-arthritis.html',
    'safety-arthritis-exercise.html',
    'safety-arthritis-home.html',
    'seasonal-arthritis-flares.html',
    'seasonal-arthritis-management.html',
    'seasonal-exercise-arthritis.html',
    'seated-exercises-for-ra-patients.html',
    'second-opinion-arthritis.html',
    'sedentary-arthritis.html',
    'seniors-arthritis-management.html',
    'severe-arthritis-pain.html',
    'shopping-arthritis-tips.html',
    'shoulder-arthritis-exercises-gentle.html',
    'shoulder-exercises-arthritis-gentle.html',
    'side-effects-tracking.html',
    'simple-arthritis-diet-meals.html',
    'singles-arthritis.html',
    'skills-arthritis.html',
    'sleep-apnea-arthritis.html',
    'sleep-breathing-exercises.html',
    'sleep-environment-arthritis.html',
    'sleep-exercises-ra-complete-guide.html',
    'sleep-hygiene-arthritis-patients.html',
    'sleep-hygiene-tips-chronic-fatigue.html',
    'sleep-journal-arthritis.html',
    'sleep-meditation-arthritis.html',
    'sleep-positions-arthritis-pain.html',
    'sleep-quality-arthritis.html',
    'sleep-schedule-arthritis.html',
    'sleep-supplements-arthritis.html',
    'sleep-tracking-apps.html',
    'sleep-tracking-arthritis.html',
    'slow-cooker-arthritis-recipes.html',
    'smart-watches-arthritis.html',
    'social-life-arthritis.html',
    'specialist-referral-arthritis.html',
    'spring-arthritis-care.html',
    'standing-desk-arthritis.html',
    'stationary-bike-arthritis-exercise.html',
    'strength-training-arthritis-gentle.html',
    'stress-management-arthritis.html',
    'stress-reduction-techniques.html',
    'stretching-routine-for-arthritis.html',
    'students-arthritis.html',
    'summer-arthritis-tips.html',
    'supplements-arthritis.html',
    'surgery-preparation-recovery-ra-complete-guide.html',
    'swimming-exercises-for-arthritis.html',
    'symptom-diary-arthritis.html',
    'symptom-tracking-for-doctor.html',
    'systemic-arthritis.html',
    'tai-chi-for-arthritis-beginners.html',
    'tai-chi-for-arthritis-pain-relief.html',
    'talking-to-rheumatologist.html',
    'telemedicine-arthritis.html',
    'temperature-arthritis-pain.html',
    'test-results-tracking.html',
    'therapy-arthritis-patients.html',
    'traditional-medicine-arthritis.html',
    'traveling-arthritis-tips.html',
    'treatment-plan-arthritis.html',
    'turmeric-recipes-for-arthritis.html',
    'vacation-arthritis-planning.html',
    'vegan-diet-arthritis.html',
    'ventilation-arthritis.html',
    'virtual-arthritis-care.html',
    'virtual-arthritis-groups.html',
    'virtual-care-arthritis.html',
    'vitamins-arthritis.html',
    'warm-up-exercises-for-morning-arthritis.html',
    'water-exercises-for-rheumatoid-arthritis.html',
    'wearable-technology-arthritis.html',
    'weather-arthritis-preparation.html',
    'weather-arthritis-symptoms.html',
    'weather-changes-arthritis.html',
    'weather-exercise-arthritis.html',
    'weather-protection-arthritis.html',
    'wellness-apps-arthritis.html',
    'wellness-tracking-arthritis.html',
    'winter-arthritis-management.html',
    'women-arthritis-management.html',
    'womens-arthritis.html',
    'work-accommodations-arthritis.html',
    'work-life-balance-arthritis.html',
    'work-stress-arthritis.html',
    'working-parents-arthritis.html',
    'workplace-accommodations-ra.html',
    'workplace-arthritis-support.html',
    'wrist-arthritis-exercises-safe.html',
    'writing-arthritis.html',
    'yoga-for-arthritis-gentle-poses.html',
    'yoga-poses-for-arthritis-pain.html',
    'yoga-stretches-arthritis-friendly.html',
    'young-adults-arthritis.html'
];

function fixSpecificBlogs() {
    const blogPostsDir = './blog-posts';
    let totalFixed = 0;
    let totalChecked = 0;

    console.log(`🔍 Checking ${targetBlogs.length} specific blog posts for broken images and footers...`);

    targetBlogs.forEach(file => {
        const filePath = path.join(blogPostsDir, file);
        
        if (!fs.existsSync(filePath)) {
            console.log(`❌ File not found: ${file}`);
            return;
        }

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

    console.log(`\n🎉 Specific blog fix complete!`);
    console.log(`📊 Summary:`);
    console.log(`   - Checked ${totalChecked} specific blog posts`);
    console.log(`   - Fixed issues in ${totalFixed} files`);
    console.log(`   - All broken images and footers should now be resolved!`);
}

// Run the specific blog fix
fixSpecificBlogs(); 