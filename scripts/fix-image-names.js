#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths
const productsFile = path.join(__dirname, '../generated/commerce/data/accs/accs_products.json');
const imageDir = path.join(__dirname, '../media/images/products');

// Load products
console.log('Loading product data...');
const products = JSON.parse(fs.readFileSync(productsFile, 'utf8')).source.items;
console.log(`Found ${products.length} products`);
console.log('');

// Build suffix to SKU map
const suffixToSku = new Map();
products.forEach(p => {
  const parts = p.sku.split('-');
  if (parts.length > 1) {
    const suffix = parts.slice(1).join('-');
    suffixToSku.set(suffix, p.sku);
  }
});

// Get all image files
const imageFiles = fs.readdirSync(imageDir).filter(f => f.endsWith('.jpg'));
console.log(`Found ${imageFiles.length} image files`);
console.log('');

// Analyze images
const renames = [];
const alreadyCorrect = [];
const orphaned = [];

imageFiles.forEach(imgFile => {
  const imgSku = imgFile.replace('.jpg', '');
  
  // Check if exact match
  if (products.find(p => p.sku === imgSku)) {
    alreadyCorrect.push(imgFile);
    return;
  }
  
  // Check if embedded match (short format - just needs prefix)
  const embeddedMatch = products.find(p => p.sku.endsWith(imgSku));
  if (embeddedMatch) {
    renames.push({
      oldName: imgFile,
      newName: `${embeddedMatch.sku}.jpg`,
      reason: 'add-prefix',
      productSku: embeddedMatch.sku
    });
    return;
  }
  
  // Check if suffix match (wrong prefix)
  const parts = imgSku.split('-');
  if (parts.length > 1) {
    const suffix = parts.slice(1).join('-');
    const correctSku = suffixToSku.get(suffix);
    if (correctSku) {
      renames.push({
        oldName: imgFile,
        newName: `${correctSku}.jpg`,
        reason: 'fix-prefix',
        productSku: correctSku,
        oldPrefix: parts[0],
        newPrefix: correctSku.split('-')[0]
      });
      return;
    }
  }
  
  // Orphaned image
  orphaned.push(imgFile);
});

// Display summary
console.log('📊 Analysis Results:');
console.log('─'.repeat(60));
console.log(`✅ Already correct:        ${alreadyCorrect.length}`);
console.log(`🔄 Need renaming:          ${renames.length}`);
console.log(`❌ Orphaned (no product):  ${orphaned.length}`);
console.log('─'.repeat(60));
console.log(`📈 Total usable after fix: ${alreadyCorrect.length + renames.length}`);
console.log('');

// Show rename breakdown
const addPrefix = renames.filter(r => r.reason === 'add-prefix');
const fixPrefix = renames.filter(r => r.reason === 'fix-prefix');

console.log('🔄 Renames needed:');
console.log(`  • Add prefix: ${addPrefix.length} images`);
console.log(`  • Fix prefix: ${fixPrefix.length} images`);
console.log('');

// Show prefix mappings
if (fixPrefix.length > 0) {
  const prefixMap = {};
  fixPrefix.forEach(r => {
    const key = `${r.oldPrefix} → ${r.newPrefix}`;
    prefixMap[key] = (prefixMap[key] || 0) + 1;
  });
  console.log('  Prefix corrections:');
  Object.entries(prefixMap).sort((a, b) => b[1] - a[1]).forEach(([mapping, count]) => {
    console.log(`    ${mapping}: ${count} images`);
  });
  console.log('');
}

// Ask for confirmation
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Proceed with renaming? (yes/no): ', (answer) => {
  if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
    console.log('Cancelled.');
    rl.close();
    process.exit(0);
  }
  
  console.log('');
  console.log('Renaming files...');
  console.log('');
  
  let success = 0;
  let errors = 0;
  
  renames.forEach(rename => {
    const oldPath = path.join(imageDir, rename.oldName);
    const newPath = path.join(imageDir, rename.newName);
    
    try {
      // Check if target already exists
      if (fs.existsSync(newPath)) {
        console.log(`⚠️  Skipping ${rename.oldName} (${rename.newName} already exists)`);
        return;
      }
      
      fs.renameSync(oldPath, newPath);
      console.log(`✓ ${rename.oldName} → ${rename.newName}`);
      success++;
    } catch (err) {
      console.error(`✗ Failed to rename ${rename.oldName}: ${err.message}`);
      errors++;
    }
  });
  
  console.log('');
  console.log('─'.repeat(60));
  console.log(`✅ Successfully renamed: ${success}`);
  if (errors > 0) {
    console.log(`❌ Errors: ${errors}`);
  }
  console.log('─'.repeat(60));
  console.log('');
  console.log('✨ Image names fixed!');
  
  if (orphaned.length > 0) {
    console.log('');
    console.log(`ℹ️  ${orphaned.length} orphaned images remain (no matching products)`);
    console.log('   These can be deleted if not needed.');
  }
  
  rl.close();
});

