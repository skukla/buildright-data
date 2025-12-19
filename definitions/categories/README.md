# Category Taxonomy

⚠️ **CRITICAL: This is a FIXED taxonomy and should NOT be modified without explicit approval.**

## Overview

This directory contains the BuildRight category taxonomy, which was finalized in **Phase 0.5 (November 2024)** as part of the unified multi-level taxonomy architecture.

## Status

✅ **LOCKED** - Do not modify without updating all related documentation and validation rules

## Files

### `category-tree.json`

**Purpose**: Defines the hierarchical category structure for BuildRight's product catalog.

**Structure**:
- **11 top-level categories** (main navigation)
- **37 total categories** (including subcategories)
- Fixed taxonomy supporting all 5 personas (Sarah, Marcus, Lisa, David, Kevin)

**Validation**: Automatically validated during data generation by `commerce-demo-generator/config/validate-category-tree.js`

## Categories

### Top-Level Categories (11)

1. **Structural Materials** (2 subcategories)
   - Lumber
   - Plywood & Sheathing

2. **Framing & Drywall** (3 subcategories)
   - Metal Studs & Track
   - Drywall
   - Insulation

3. **Windows & Doors** (2 subcategories)
   - Windows
   - Doors

4. **Fasteners & Hardware** (2 subcategories)
   - Nails
   - Screws

5. **Roofing** (3 subcategories)
   - Shingles
   - Underlayment
   - Siding

6. **Interior Finishes** (4 subcategories)
   - Flooring
   - Paint
   - Lighting
   - Plumbing Fixtures

7. **Concrete & Foundation** (no subcategories)

8. **Electrical Systems** (3 subcategories)
   - Wiring
   - Devices
   - Panels

9. **Plumbing Pipes & Fittings** (3 subcategories)
   - Water Supply
   - Drain & Waste
   - Fittings

10. **HVAC Systems** (3 subcategories)
    - Units
    - Ductwork
    - Vents & Thermostats

11. **Kitchen Appliances** (no subcategories)

## Architecture

This category structure is part of the **Unified Multi-Level Taxonomy** approach, where:

- **Categories**: Provide basic navigation structure (this file)
- **Attributes**: Provide persona-specific filtering (via `br_*` custom attributes)
- **One Catalog**: Serves all 5 personas through intelligent attribute-based filtering

## Related Documentation

### Strategic Decision
- **`buildright-eds/docs/implementation/sarah-end-to-end/features/PRODUCT-TAXONOMY-ANALYSIS.md`**
  - Defines the overall unified taxonomy approach
  - Analyzes all 5 personas and their mental models
  - Recommends Option A: Unified Multi-Level Taxonomy

### Implementation
- **`buildright-eds/docs/implementation/sarah-end-to-end/features/PRODUCT-CATEGORY-TAXONOMY-MAPPING.md`**
  - Maps the 6 new Phase 0.5 categories to the taxonomy
  - Shows how each persona uses the categories
  - Documents attribute mappings

### Validation
- **`commerce-demo-generator/config/validate-category-tree.js`**
  - Contains the fixed taxonomy structure
  - Validates against this file during generation
  - Prevents accidental modifications

## Modification Process

⚠️ **Do not modify `category-tree.json` directly!**

If changes are needed:

1. **Review** with stakeholders (Product, Architecture)
2. **Update** documentation:
   - This README
   - PRODUCT-TAXONOMY-ANALYSIS.md
   - PRODUCT-CATEGORY-TAXONOMY-MAPPING.md
3. **Update** validation:
   - `validate-category-tree.js` → Update `FIXED_CATEGORY_TAXONOMY`
4. **Update** product attributes:
   - Ensure all products are tagged correctly for new categories
5. **Test** all persona experiences:
   - Sarah's construction phase view
   - Marcus's traditional category view
   - Lisa's room-based view
   - David's project-based view
   - Kevin's velocity-based view
6. **Regenerate** data:
   - `npm run generate:all`
7. **Test** ingestion:
   - `npm run import:aco`
   - `npm run import:commerce`
8. **Verify** frontend:
   - Check category navigation for all personas
9. **Commit** all changes together

## Notes

- Categories are **persona-neutral** (not optimized for any single persona)
- Persona-specific views are achieved through **attribute filtering**, not separate catalogs
- Adding products to existing categories is safe
- Adding **new** categories requires full modification process above

## History

- **Phase 6 Original (Early 2024)**: 5 basic categories
- **Phase 0.5 (November 2024)**: Expanded to 11 categories with 6 new additions:
  - Concrete & Foundation
  - Electrical Systems
  - Plumbing Pipes & Fittings
  - HVAC Systems
  - Drywall & Supplies (moved from Framing & Drywall)
  - Kitchen Appliances

---

**Status**: ✅ Locked  
**Last Updated**: December 2024  
**Owner**: BuildRight Product Architecture Team

