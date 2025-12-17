# BuildRight Features

This directory contains BuildRight-specific feature definitions that power unique functionality in the BuildRight demo system.

---

## Files

### **bom-product-criteria.json**
Product selection rules for BOM (Bill of Materials) generation.

**Used by:** `buildright-service` (BOM generation action)

**Purpose:**
- Defines product selection criteria for each construction phase
- Maps construction phases to product categories and attributes
- Enables automatic material selection for project templates

**Example:**
```json
{
  "foundation_framing": {
    "concrete_slab": {
      "label": "Ready-Mix Concrete for Slab Foundation",
      "construction_phase": "Foundation & Framing",
      "product_category": "Concrete & Foundation",
      "concrete_type": "ready_mix",
      "concrete_psi": "3000"
    }
  }
}
```

**Construction Phases:**
- `foundation_framing` - Foundation and structural framing
- `envelope` - Building envelope (windows, doors, roofing, siding)
- `interior_finish` - Interior finishes (flooring, paint, fixtures)

---

### **templates.json**
Home templates for the BuildRight project builder.

**Used by:** `buildright-eds` (Project Builder), `buildright-service` (BOM generation)

**Purpose:**
- Defines available home templates (e.g., Sedona 2450, Ranch 1200)
- Specifies floor plans, dimensions, and base specs
- Lists available variants and material packages per template

**Example:**
```json
[
  {
    "id": "sedona-2450",
    "name": "Sedona 2450",
    "description": "Classic ranch-style home perfect for growing families",
    "baseSpecs": {
      "sqft": 2450,
      "stories": 1,
      "bedrooms": 3,
      "bathrooms": 2
    },
    "availableVariants": ["standard", "bonus-room", "3-car-garage"],
    "availablePackages": ["builders-choice", "desert-ridge-premium"]
  }
]
```

**Templates:**
- **Sedona 2450** - Classic ranch-style, 2450 sq ft, 3 bed/2 bath
- **Ranch 1200** - Compact starter home, 1200 sq ft, 3 bed/2 bath

---

### **material-packages.json**
Pre-configured material bundles for different customer personas.

**Used by:** `buildright-eds` (Project Builder), `buildright-service`

**Purpose:**
- Defines material packages that group products by quality tier
- Maps packages to customer personas (DIY, Production Builder, etc.)
- Provides curated product selections for different budget levels

**Package Tiers:**
- **Essential** - Budget-conscious, basic materials
- **Builders Choice** - Mid-tier, balanced quality and cost
- **Premium** - High-end materials and finishes

**Personas:**
- **DIY Homeowner** - Essential packages
- **Production Builder** - Builders Choice packages
- **Custom Builder** - Premium packages

---

### **template-variants.json**
Variant configurations for home templates.

**Used by:** `buildright-service` (Template customization)

**Purpose:**
- Defines available variants for each template
- Specifies how variants modify base template specs
- Enables customization of templates (e.g., adding bonus room, upgrading garage)

**Variant Types:**
- Standard configurations
- Room additions (bonus room, office)
- Garage upgrades (2-car to 3-car)
- Foundation options (slab, crawl space, basement)

---

## How These Features Work Together

### Project Builder Flow

1. **User selects a template** (`templates.json`)
   - Sedona 2450, Ranch 1200, etc.
   
2. **User selects variants** (`template-variants.json`)
   - Standard, bonus room, 3-car garage, etc.
   
3. **User selects material package** (`material-packages.json`)
   - Essential, Builders Choice, Premium
   
4. **System generates BOM** (`bom-product-criteria.json`)
   - Matches construction phases to products
   - Applies product selection criteria
   - Generates complete material list
   
5. **User reviews & purchases**
   - BOM displayed in buildright-eds
   - Products added to cart
   - Order placed

### Backend Integration

**buildright-service** actions:
- `generate-bom` - Uses `bom-product-criteria.json` to create BOMs
- `get-templates` - Returns `templates.json` to frontend
- `get-packages` - Returns `material-packages.json` filtered by persona

**buildright-eds** blocks:
- `project-builder` - Displays templates and variants
- `project-filter` - Filters by material package
- `bom-review` - Shows generated BOM

---

## Data Source

These files were migrated from `buildright-aco/data/buildright/` during the repository consolidation (December 16, 2025).

**Original Location:**
- `buildright-aco/data/buildright/bom-product-criteria.json`
- `buildright-aco/data/buildright/templates.json`
- `buildright-aco/data/buildright/material-packages.json`
- `buildright-aco/data/buildright/template-variants.json`

**Migration Reason:**
- Consolidate all BuildRight data in `buildright-data`
- Remove cross-repo dependencies
- Align with 3-repo architecture

---

## Updating Feature Data

### To Add a New Template

Edit `templates.json`:
```json
{
  "id": "new-template-id",
  "name": "New Template Name",
  "description": "Description here",
  "baseSpecs": { ... },
  "availableVariants": ["standard"],
  "availablePackages": ["builders-choice"]
}
```

### To Add a New BOM Criteria

Edit `bom-product-criteria.json`:
```json
{
  "construction_phase": {
    "new_criteria": {
      "label": "Display Name",
      "construction_phase": "Phase Name",
      "product_category": "Category",
      "attribute_name": "attribute_value"
    }
  }
}
```

### To Add a New Material Package

Edit `material-packages.json`:
```json
{
  "package_id": "new-package",
  "name": "New Package Name",
  "tier": "premium",
  "targetPersonas": ["custom-builder"],
  "products": [...]
}
```

---

## Dependencies

**These files are consumed by:**
- `buildright-service` (App Builder backend)
- `buildright-eds` (Frontend storefront)

**After updating these files:**
1. No regeneration needed (they're source definitions)
2. Restart `buildright-service` if running locally
3. Refresh `buildright-eds` if running locally
4. Deploy changes to production as needed

---

## Related Documentation

- **[../aco/pricing-rules.json](../aco/pricing-rules.json)** - ACO pricing tied to product categories
- **[../products/catalog.json](../products/catalog.json)** - Product catalog that BOM criteria references
- **[../../docs/architecture/](../../docs/architecture/)** - BuildRight architecture documentation

---

**Last Updated:** December 16, 2025  
**Status:** ✅ Active - Used in production

