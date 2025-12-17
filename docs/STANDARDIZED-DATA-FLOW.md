# Standardized Data Flow: BuildRight Demo System

**Created**: December 17, 2025  
**Status**: ✅ Implemented

---

## Overview

The BuildRight demo system follows a **standardized, unidirectional data flow** from source definitions through generation, ingestion, and consumption. This document describes the complete flow and the responsibilities of each repository.

---

## Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│ 1. SOURCE DEFINITIONS (buildright-data/definitions/)                │
│    Human-editable JSON files                                         │
│                                                                       │
│    ├── products/catalog.json           (281 products)                │
│    ├── categories/category-tree.json   (37 categories)               │
│    ├── customers/demo-customers.json   (5 customers)                 │
│    ├── attributes/*.json               (42 custom attributes)        │
│    ├── aco/*.json                      (pricing rules, price books)  │
│    └── media/images/products/*.jpg     (source product images)       │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│ 2. GENERATION (commerce-demo-generator/)                             │
│    Transforms definitions → platform-specific datapacks              │
│                                                                       │
│    Commands:                                                         │
│    • npm run generate:commerce                                       │
│    • npm run generate:aco                                            │
│    • npm run generate:all                                            │
│                                                                       │
│    Process:                                                          │
│    1. Read from buildright-data/definitions/                         │
│    2. Apply transformations (SKU generation, descriptions, etc.)     │
│    3. Generate platform-specific formats                             │
│    4. Extract images from JSON → media/images/products/              │
│    5. Write to buildright-data/generated/                            │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│ 3. GENERATED DATAPACKS (buildright-data/generated/)                 │
│    Ready-to-import, version-controlled artifacts                     │
│                                                                       │
│    ├── commerce/                                                     │
│    │   ├── data/accs/                  (ACCS format for Commerce)    │
│    │   │   ├── accs_products.json      (281 products)                │
│    │   │   ├── accs_product_images_*.json  (33 images as base64)    │
│    │   │   ├── accs_categories.json                                  │
│    │   │   ├── accs_customers.json                                   │
│    │   │   └── ...                                                   │
│    │   └── media/catalog/product/      (Images for Commerce import)  │
│    │       └── {first}/{second}/{sku}.jpeg                           │
│    │                                                                  │
│    ├── aco/                             (ACO format)                 │
│    │   ├── products.json                (281 products)                │
│    │   ├── prices.json                  (pricing rules)              │
│    │   ├── price-books.json                                          │
│    │   └── ...                                                       │
│    │                                                                  │
│    └── media/images/products/           (Images for frontend) ⭐ NEW │
│        ├── STR-49C283DE.jpeg            (33 images extracted)        │
│        ├── FRA-1253AF84.jpeg                                         │
│        └── ...                                                       │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│ 4. INGESTION (commerce-demo-ingestion/)                              │
│    Imports datapacks to live systems                                 │
│                                                                       │
│    Commands:                                                         │
│    • npm run import:commerce           (→ Adobe Commerce)            │
│    • npm run import:aco                (→ ACO)                       │
│    • npm run import:all                (→ Both)                      │
│                                                                       │
│    Process:                                                          │
│    1. Read from buildright-data/generated/                           │
│    2. Validate data                                                  │
│    3. Import to Commerce REST API / ACO GraphQL                      │
│    4. Track state for resume/retry                                   │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│ 5. LIVE SYSTEMS                                                      │
│                                                                       │
│    ┌─────────────────────────────────────────────────────────────┐  │
│    │ Adobe Commerce (PaaS)                                        │  │
│    │ • Product catalog (281 products)                             │  │
│    │ • Media gallery (33 images)                                  │  │
│    │ • Customer data, attributes, MSI                             │  │
│    └─────────────────────────────────────────────────────────────┘  │
│                              ↓                                        │
│    ┌─────────────────────────────────────────────────────────────┐  │
│    │ Adobe Commerce Optimizer (ACO)                               │  │
│    │ • Product catalog (281 products)                             │  │
│    │ • Pricing rules, price books                                 │  │
│    │ • Catalog views                                              │  │
│    └─────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│ 6. FRONTEND CONSUMPTION                                              │
│                                                                       │
│    ┌─────────────────────────────────────────────────────────────┐  │
│    │ buildright-service (API Mesh)                                │  │
│    │ • Queries ACO for products                                   │  │
│    │ • Queries Commerce for cart/checkout (via Dropins)          │  │
│    │ • Custom BOM generation                                      │  │
│    └─────────────────────────────────────────────────────────────┘  │
│                              ↓                                        │
│    ┌─────────────────────────────────────────────────────────────┐  │
│    │ buildright-eds (Frontend)                                    │  │
│    │ • Syncs images from buildright-data/media/images/products/  │  │
│    │ • Displays catalog, cart, checkout                           │  │
│    │ • Convention-based image URLs: /images/products/{SKU}.jpeg  │  │
│    └─────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Repository Responsibilities

### **buildright-data** (Source of Truth)
📁 **Role**: Data repository

**Stores**:
- ✅ Source definitions (human-editable)
- ✅ Generated datapacks (committed to git)
- ✅ Media assets (product images)

**Does NOT**:
- ❌ Generate data (that's commerce-demo-generator)
- ❌ Import data (that's commerce-demo-ingestion)

---

### **commerce-demo-generator** (Generic Tool)
⚙️ **Role**: Data transformation engine

**Responsibilities**:
1. Read source definitions from buildright-data
2. Generate platform-specific datapacks
3. **Extract images from JSON → media/images/products/** ⭐ NEW
4. Write datapacks to buildright-data/generated/

**Input**: `buildright-data/definitions/`  
**Output**: `buildright-data/generated/`

**Commands**:
```bash
cd commerce-demo-generator
npm run generate:commerce  # → Commerce ACCS format + extract images
npm run generate:aco       # → ACO format
npm run generate:all       # → Both
```

---

### **commerce-demo-ingestion** (Generic Tool)
📥 **Role**: Data import engine

**Responsibilities**:
1. Read generated datapacks from buildright-data
2. Import to live Commerce/ACO instances
3. Handle retries, validation, state tracking

**Input**: `buildright-data/generated/`  
**Output**: Live Commerce/ACO systems

**Commands**:
```bash
cd commerce-demo-ingestion
npm run import:commerce    # → Import to Commerce
npm run import:aco         # → Import to ACO
npm run import:all         # → Both
```

---

### **buildright-eds** (Frontend)
🎨 **Role**: User interface

**Responsibilities**:
1. **Sync images** from buildright-data
2. Display catalog, cart, checkout
3. Handle missing images gracefully (CSS placeholders)

**Does NOT**:
- ❌ Extract images from JSON (that's commerce-demo-generator)
- ❌ Generate data

**Commands**:
```bash
cd buildright-eds
./scripts/sync-product-images.sh  # → Copy from buildright-data
```

---

### **buildright-service** (Backend)
⚙️ **Role**: API aggregation and business logic

**Responsibilities**:
1. Query ACO for product data
2. Query Commerce for cart/checkout (direct connection for Dropins)
3. Custom resolvers (BOM generation, persona detection)
4. Return image URLs using convention: `/images/products/{SKU}.jpeg`

**Does NOT**:
- ❌ Store images
- ❌ Generate data

---

## Product Images: Standardized Flow

### **Before (Broken)**
```
❌ buildright-data/media/images/products/  (manual files)
      ↓
   [manual copy]
      ↓
❌ buildright-eds/images/products/  (out of sync)
      ↓
   [manual extraction script]
      ↓
❌ Extracted from JSON (wrong repo)
```

### **After (Standardized)** ⭐
```
✅ buildright-data/definitions/media/images/products/  (source images)
      ↓
   [commerce-demo-generator reads images]
      ↓
✅ buildright-data/generated/commerce/data/accs/accs_product_images_*.json  (base64 for Commerce import)
      ↓
   [commerce-demo-generator extracts images] ⭐ NEW
      ↓
✅ buildright-data/media/images/products/  (extracted images for frontend)
      ↓
   [buildright-eds syncs via rsync]
      ↓
✅ buildright-eds/images/products/  (frontend serving)
```

---

## Key Principles

### 1. **Single Source of Truth**
- ✅ buildright-data/definitions/ is the ONLY place to edit data
- ✅ generated/ is version-controlled for reproducibility
- ✅ All downstream systems pull from buildright-data

### 2. **Unidirectional Flow**
- ✅ Source → Generate → Ingest → Consume
- ❌ Never modify generated files directly
- ❌ Never extract/transform in consuming repos

### 3. **Separation of Concerns**
- ✅ buildright-data: Storage
- ✅ commerce-demo-generator: Transformation
- ✅ commerce-demo-ingestion: Import
- ✅ buildright-eds: Presentation

### 4. **Reproducibility**
- ✅ Generated artifacts are committed to git
- ✅ Any developer can regenerate from source
- ✅ Known-good datapacks for stable demos

---

## Common Workflows

### **Adding a New Product**

```bash
# 1. Edit source
cd buildright-data
vim definitions/products/catalog.json  # Add product

# 2. Regenerate datapacks
cd ../commerce-demo-generator
npm run generate:all  # ← Automatically extracts images

# 3. Import to live systems
cd ../commerce-demo-ingestion
npm run import:all

# 4. Sync images to frontend
cd ../buildright-eds
npm run sync:images  # ← Simple rsync
```

### **Adding a Product Image**

```bash
# 1. Add image to source
cd buildright-data
cp ~/my-image.jpg media/images/products/NEW-SKU.jpg

# 2. Update IMAGE-PRODUCT-MAPPING.json
vim media/images/products/IMAGE-PRODUCT-MAPPING.json

# 3. Regenerate datapacks
cd ../commerce-demo-generator
npm run generate:commerce  # ← Automatically extracts NEW-SKU.jpg

# 4. Import images to Commerce
cd ../commerce-demo-ingestion
npm run import:commerce

# 5. Sync to frontend
cd ../buildright-eds
npm run sync:images  # ← NEW-SKU.jpeg now available
```

### **Full Reset**

```bash
# 1. Delete all data
cd commerce-demo-ingestion
npm run delete:all

# 2. Regenerate datapacks (if source changed)
cd ../commerce-demo-generator
npm run generate:all  # ← Extracts images

# 3. Reimport everything
cd ../commerce-demo-ingestion
npm run import:all

# 4. Sync images
cd ../buildright-eds
npm run sync:images
```

---

## Image Extraction Details

### **What Changed**

**New Function** in `commerce-demo-generator/generators/generate-commerce.js`:

```javascript
/**
 * Extract product images from generated JSON to media/images/products/
 * This provides a source for frontend image syncing
 */
function extractProductImagesToMedia(productImages, outputMediaPath) {
  ensureDir(outputMediaPath);
  let extractedCount = 0;
  
  for (const item of productImages) {
    const sku = item.product.sku;
    const entries = item.product.media_gallery_entries || [];
    
    for (const entry of entries) {
      if (entry.content?.base64_encoded_data) {
        const buffer = Buffer.from(entry.content.base64_encoded_data, 'base64');
        const mimeType = entry.content.type || 'image/jpeg';
        const ext = mimeType.split('/')[1] || 'jpeg';
        const outputFile = join(outputMediaPath, `${sku}.${ext}`);
        
        writeFileSync(outputFile, buffer);
        extractedCount++;
      }
    }
  }
  
  return extractedCount;
}
```

**Called during generation**:
```javascript
// Generate product images JSON (for Commerce import)
const productImages = generateProductImagesJson(allProducts);

// Write JSON files
writeFileSync(join(DATA_DIR, 'accs_product_images_*.json'), ...);

// Copy to media/catalog/product (for Commerce import)
copyProductImages(MEDIA_DIR);

// ⭐ NEW: Extract to media/images/products/ (for frontend sync)
extractProductImagesToMedia(productImages, frontendMediaPath);
```

---

## Benefits

### ✅ Consistency
- All data follows the same flow
- Images are treated like any other generated artifact

### ✅ Automation
- Image extraction happens automatically during generation
- No manual steps required

### ✅ Maintainability
- Logic in one place (generator)
- Frontend just syncs files (simple rsync)

### ✅ Reproducibility
- Generated artifacts are committed
- Easy rollback if needed

### ✅ Simplicity
- Frontend has no extraction logic
- Clear separation of concerns

---

## Testing

### **Verify Image Extraction**

```bash
# 1. Generate datapacks
cd commerce-demo-generator
npm run generate:commerce

# 2. Check extracted images
ls -l ../buildright-data/media/images/products/*.jpeg
# Expected: 33 images with SKU names

# 3. Verify JSON files
cat ../buildright-data/generated/commerce/data/accs/accs_product_images_1.json | jq '.[] | .product.sku'
# Expected: Match the .jpeg filenames

# 4. Sync to frontend
cd ../buildright-eds
./scripts/sync-product-images.sh
# Expected: "Images in buildright-eds (after): 33"
```

---

## Documentation References

- **Source definitions**: `buildright-data/README.md`
- **Generator**: `commerce-demo-generator/README.md`
- **Ingestion**: `commerce-demo-ingestion/README.md`
- **Frontend images**: `buildright-eds/docs/implementation/PRODUCT-IMAGES-CONVENTION.md`
- **Architecture**: `buildright-eds/docs/quick-reference/architecture-overview.md`

---

**Last Updated**: December 17, 2025  
**Status**: ✅ Fully Implemented


