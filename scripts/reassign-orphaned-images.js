#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths
const productsFile = path.join(__dirname, '../generated/commerce/data/accs/accs_products.json');
const imageDir = path.join(__dirname, '../media/images/products');

// Category mappings
const CATEGORY_MAPPINGS = {
  'WINDOW': 'BuildRight Catalog/Windows & Doors',
  'DOOR': 'BuildRight Catalog/Windows & Doors',
  'DRYWALL': 'BuildRight Catalog/Drywall & Supplies',
  'LBR': 'BuildRight Catalog/Structural Materials',
  'STUD': 'BuildRight Catalog/Structural Materials',
  'PLY': 'BuildRight Catalog/Structural Materials',
  'INSUL': 'BuildRight Catalog/Structural Materials'
};

console.log('📦 Reassigning Orphaned Images to Products');
console.log('═'.repeat(80));
console.log('');

// Load products
console.log('Loading product data...');
const products = JSON.parse(fs.readFileSync(productsFile, 'utf8')).source.items;
console.log(`Found ${products.length} products`);
console.log('');

// Get all image files
const imageFiles = fs.readdirSync(imageDir).filter(f => f.endsWith('.jpg'));
const imagedSkus = new Set(imageFiles.map(f => f.replace('.jpg', '')));

// Find orphaned images by category
const orphanedByCategory = {};
imageFiles.forEach(imgFile => {
  const imgSku = imgFile.replace('.jpg', '');
  
  // Skip if already matched to a product
  if (products.find(p => p.sku === imgSku)) {
    return;
  }
  
  // Check if this is an orphaned image we can reassign
  const parts = imgSku.split('-');
  if (parts.length > 1) {
    const prefix = parts[0];
    if (CATEGORY_MAPPINGS[prefix]) {
      if (!orphanedByCategory[prefix]) {
        orphanedByCategory[prefix] = [];
      }
      orphanedByCategory[prefix].push(imgFile);
    }
  }
});

// Find products without images by category
const productsNeedingImages = {};
Object.entries(CATEGORY_MAPPINGS).forEach(([prefix, category]) => {
  const categoryProducts = products.filter(p => p.categories === category && !imagedSkus.has(p.sku));
  productsNeedingImages[category] = categoryProducts;
});

// Display current state
console.log('📊 Orphaned Images by Category:');
console.log('─'.repeat(80));
Object.entries(orphanedByCategory).forEach(([prefix, images]) => {
  const category = CATEGORY_MAPPINGS[prefix];
  const available = productsNeedingImages[category]?.length || 0;
  console.log(`${prefix.padEnd(10)} : ${images.length} images → ${category}`);
  console.log(`${' '.repeat(13)}(${available} products need images in this category)`);
});
console.log('');

// Create reassignment plan
const reassignments = [];
const usedProducts = new Set(); // Track which products already have an image assigned

Object.entries(orphanedByCategory).forEach(([prefix, images]) => {
  const category = CATEGORY_MAPPINGS[prefix];
  const availableProducts = productsNeedingImages[category].filter(p => !usedProducts.has(p.sku));
  
  if (!availableProducts || availableProducts.length === 0) {
    console.log(`⚠️  Warning: No products available in ${category} for ${prefix} images`);
    return;
  }
  
  // Assign images to products (one-to-one)
  images.forEach((imgFile, index) => {
    if (index < availableProducts.length) {
      const product = availableProducts[index];
      reassignments.push({
        oldName: imgFile,
        newName: `${product.sku}.jpg`,
        productSku: product.sku,
        productName: product.name,
        category: category
      });
      usedProducts.add(product.sku); // Mark this product as assigned
    }
  });
});

// Display reassignment plan
console.log('📋 Reassignment Plan:');
console.log('─'.repeat(80));
reassignments.forEach((r, i) => {
  console.log(`${String(i + 1).padStart(2)}. ${r.oldName}`);
  console.log(`    → ${r.newName}`);
  console.log(`    Product: ${r.productName}`);
  console.log('');
});

console.log('─'.repeat(80));
console.log(`Total reassignments: ${reassignments.length}`);
console.log('');

// Ask for confirmation
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Proceed with reassignment? (yes/no): ', (answer) => {
  if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
    console.log('Cancelled.');
    rl.close();
    process.exit(0);
  }
  
  console.log('');
  console.log('Reassigning images...');
  console.log('');
  
  let success = 0;
  let errors = 0;
  
  reassignments.forEach(reassignment => {
    const oldPath = path.join(imageDir, reassignment.oldName);
    const newPath = path.join(imageDir, reassignment.newName);
    
    try {
      // Check if target already exists
      if (fs.existsSync(newPath)) {
        console.log(`⚠️  Skipping ${reassignment.oldName} (${reassignment.newName} already exists)`);
        return;
      }
      
      fs.renameSync(oldPath, newPath);
      console.log(`✓ ${reassignment.oldName} → ${reassignment.newName}`);
      success++;
    } catch (err) {
      console.error(`✗ Failed to rename ${reassignment.oldName}: ${err.message}`);
      errors++;
    }
  });
  
  console.log('');
  console.log('═'.repeat(80));
  console.log(`✅ Successfully reassigned: ${success}`);
  if (errors > 0) {
    console.log(`❌ Errors: ${errors}`);
  }
  console.log('═'.repeat(80));
  console.log('');
  
  // Final stats
  const finalImageFiles = fs.readdirSync(imageDir).filter(f => f.endsWith('.jpg'));
  const finalMatched = finalImageFiles.filter(imgFile => {
    const imgSku = imgFile.replace('.jpg', '');
    return products.find(p => p.sku === imgSku);
  }).length;
  
  console.log('📈 Final Statistics:');
  console.log(`   Products with images: ${finalMatched} / ${products.length}`);
  console.log(`   Total images: ${finalImageFiles.length}`);
  console.log('');
  console.log('✨ Image reassignment complete!');
  
  rl.close();
});

