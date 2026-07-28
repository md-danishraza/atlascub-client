/**
 * Atlascub E-Commerce Asset Downloader
 * * This zero-dependency Node.js script automates the creation of your
 * public/images/ directory tree and streams curated, high-resolution
 * premium editorial imagery matching our modern menswear and luxury theme.
 * * Usage:
 * 1. Place this file in the root of your 'atlascub-client' directory.
 * 2. Run: node download-assets.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// --- CURATED PREMIUM EDITORIAL IMAGE SET ---
const ASSETS_MAP = {
  // Hero Section Banners
  'hero/hero-1.jpg': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
  'hero/hero-1-mobile.jpg': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=640&h=960&auto=format&fit=crop',
  'hero/hero-2.jpg': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
  'hero/hero-2-mobile.jpg': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=640&h=960&auto=format&fit=crop',

  // Department / Gender Panels
  'gender/men.jpg': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&h=1000&auto=format&fit=crop',
  'gender/women.jpg': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&h=1000&auto=format&fit=crop',
  'gender/kids.jpg': 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=800&h=1000&auto=format&fit=crop',

  // Curated Storytelling Campaigns
  'campaigns/pastel-dreams.jpg': 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&h=1000&auto=format&fit=crop',
  'campaigns/quiet-luxury.jpg': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&h=1000&auto=format&fit=crop',
  'campaigns/streetwear-core.jpg': 'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&h=1000&auto=format&fit=crop',
  'campaigns/heritage.jpg': 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&h=1000&auto=format&fit=crop',

  // Functional Category Overviews
  'categories/outerwear.jpg': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&h=1000&auto=format&fit=crop',
  'categories/tops.jpg': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&h=1000&auto=format&fit=crop',
  'categories/bottoms.jpg': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&h=1000&auto=format&fit=crop',
  'categories/accessories.jpg': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&h=1000&auto=format&fit=crop',

  // Instagram Feed Behind-the-Scenes Posts (Square Grid Optimized)
  'instagram/post-1.jpg': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&h=600&auto=format&fit=crop',
  'instagram/post-2.jpg': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&h=600&auto=format&fit=crop',
  'instagram/post-3.jpg': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&h=600&auto=format&fit=crop',
  'instagram/post-4.jpg': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&h=600&auto=format&fit=crop',
  'instagram/post-5.jpg': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&h=600&auto=format&fit=crop',
  'instagram/post-6.jpg': 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?q=80&w=600&h=600&auto=format&fit=crop'
};

// Target directory base path setup (under public folder)
const TARGET_BASE_DIR = path.join(process.cwd(), 'public', 'images');

/**
 * Downloads a binary file from a secure URL and saves it to a designated disk path
 */
function downloadFile(url, targetPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // Handle HTTP redirects securely
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, targetPath)
          .then(resolve)
          .catch(reject);
      }

      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to load asset. Status: ${response.statusCode}`));
      }

      const fileStream = fs.createWriteStream(targetPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(targetPath, () => {}); // Rollback partial files
        reject(err);
      });
    }).on('error', reject);
  });
}

/**
 * Core initialization runner
 */
async function run() {
  console.log('\x1b[35m%s\x1b[0m', '==================================================');
  console.log('\x1b[35m%s\x1b[0m', '      ATLAS_CUB EDITORIAL IMAGERY INITIALIZER     ');
  console.log('\x1b[35m%s\x1b[0m', '==================================================\n');

  // 1. Ensure target structural directories exist cleanly
  const subdirs = ['hero', 'gender', 'campaigns', 'categories', 'instagram'];
  
  console.log('📁 Creating image directory tree...');
  if (!fs.existsSync(TARGET_BASE_DIR)) {
    fs.mkdirSync(TARGET_BASE_DIR, { recursive: true });
  }
  
  for (const dir of subdirs) {
    const fullPath = path.join(TARGET_BASE_DIR, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`   └─ Created: public/images/${dir}/`);
    }
  }
  console.log('✅ Directories ready.\n');

  // 2. Download each curated asset sequentially
  const entries = Object.entries(ASSETS_MAP);
  console.log(`📡 Commencing download of ${entries.length} curated high-resolution files...`);

  for (let i = 0; i < entries.length; i++) {
    const [relativePath, url] = entries[i];
    const fullTargetPath = path.join(TARGET_BASE_DIR, relativePath);
    
    process.stdout.write(`   [${i + 1}/${entries.length}] Syncing public/images/${relativePath}... `);
    
    try {
      await downloadFile(url, fullTargetPath);
      console.log('\x1b[32m%s\x1b[0m', 'DONE');
    } catch (error) {
      console.log('\x1b[31m%s\x1b[0m', 'FAILED');
      console.error(`      └─ Error details: ${error.message}`);
    }
  }

  console.log('\n\x1b[32m%s\x1b[0m', '🎉 All high-resolution editorial assets synced successfully!');
  console.log('   Go ahead and use these folders directly in your Next.js frontend pages.\n');
}

run().catch((error) => {
  console.error('\n❌ Initialization process encountered a critical exception:', error);
});