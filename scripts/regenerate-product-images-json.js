#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths
const productsFile = path.join(__dirname, '../generated/commerce/data/accs/accs_products.json');
const imageDir = path.join(__dirname, '../media/images/products');
const outputDir = path.join(__dirname, '../generated/commerce/data/accs');

console.log('🖼️  Regenerating Product Images JSON Files');
console.log('═'.repeat(80));
console.log('');

// Load products
console.log('Loading product data...');
const products = JSON.parse(fs.readFileSync(productsFile, 'utf8')).source.items;
const productBySku = new Map(products.map(p => [p.sku, p]));
console.log(`Found ${products.length} products`);
console.log('');

// Get all image files
console.log('Scanning image directory...');
const imageFiles = fs.readdirSync(imageDir).filter(f => f.endsWith('.jpg'));
console.log(`Found ${imageFiles.length} image files`);
console.log('');

// Match images to products
const matched = [];
const unmatched = [];

imageFiles.forEach(imgFile => {
  const sku = imgFile.replace('.jpg', '');
  const product = productBySku.get(sku);
  
  if (product) {
    matched.push({ sku, imgFile, product });
  } else {
    unmatched.push(imgFile);
  }
});

console.log('📊 Image Matching Results:');
console.log('─'.repeat(80));
console.log(`✅ Matched: ${matched.length} images`);
console.log(`❌ Unmatched: ${unmatched.length} images`);
console.log('');

if (unmatched.length > 0) {
  console.log('⚠️  Unmatched images (will be skipped):');
  unmatched.forEach(img => console.log(`   ${img}`));
  console.log('');
}

// Generate product image entries
console.log('Generating image entries...');
const imageEntries = [];

for (const { sku, imgFile, product } of matched) {
  const imgPath = path.join(imageDir, imgFile);
  const imageBuffer = fs.readFileSync(imgPath);
  const base64Data = imageBuffer.toString('base64');
  
  // Create Commerce-compatible image entry
  const entry = {
    product: {
      sku: sku,
      media_gallery_entries: [
        {
          media_type: 'image',
          label: '',
          position: 1,
          disabled: false,
          types: ['image', 'small_image', 'thumbnail'],
          content: {
            base64_encoded_data: base64Data,
            type: 'image/jpeg',
            name: `${sku}.jpg`
          }
        }
      ]
    }
  };
  
  imageEntries.push(entry);
  process.stdout.write(`\r  Processed: ${imageEntries.length}/${matched.length}`);
}
console.log('');
console.log('');

// Split into chunks (5 per file to match existing pattern)
const CHUNK_SIZE = 5;
const chunks = [];
for (let i = 0; i < imageEntries.length; i += CHUNK_SIZE) {
  chunks.push(imageEntries.slice(i, i + CHUNK_SIZE));
}

console.log(`Splitting into ${chunks.length} files (${CHUNK_SIZE} per file)...`);
console.log('');

// Delete old image files
console.log('Removing old image JSON files...');
const oldFiles = fs.readdirSync(outputDir).filter(f => f.match(/^accs_product_images_\d+\.json$/));
oldFiles.forEach(f => {
  fs.unlinkSync(path.join(outputDir, f));
  console.log(`  Deleted: ${f}`);
});
console.log('');

// Write new files
console.log('Writing new image JSON files...');
chunks.forEach((chunk, index) => {
  const filename = `accs_product_images_${index + 1}.json`;
  const filepath = path.join(outputDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(chunk, null, 2));
  console.log(`  ✓ ${filename} (${chunk.length} products)`);
});

console.log('');
console.log('═'.repeat(80));
console.log('✅ Product images JSON files regenerated!');
console.log('');
console.log(`   Total files: ${chunks.length}`);
console.log(`   Total products with images: ${imageEntries.length}`);
console.log('');
console.log('📋 Next Steps:');
console.log('   1. Import Commerce data:');
console.log('      cd ../commerce-demo-ingestion/commerce');
console.log('      npm run import');
console.log('');
console.log('   2. Regenerate ACO data:');
console.log('      cd ../commerce-demo-generator');
console.log('      npm run generate:aco');
console.log('');
console.log('   3. Import ACO data:');
console.log('      cd ../commerce-demo-ingestion/aco');
console.log('      npm run import');
console.log('');
console.log('   4. Sync images to frontend:');
console.log('      cd ../buildright-eds');
console.log('      npm run sync:images');
console.log('');

