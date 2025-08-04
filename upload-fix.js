const fs = require('fs');
const path = require('path');

// Files that need to be accessible
const filesToCheck = [
  'how-to-reduce-morning-joint-stiffness.html',
  'blog-posts/healthy-habits-chronic-illness.html'
];

console.log('Checking if files exist locally:');
filesToCheck.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${file}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
});

console.log('\nFiles are ready for deployment. Please:');
console.log('1. Go to your Vercel dashboard');
console.log('2. Find your beingwell.health project');
console.log('3. Trigger a manual deployment or upload these files:');
filesToCheck.forEach(file => {
  console.log(`   - ${file}`);
}); 