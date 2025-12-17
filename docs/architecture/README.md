# BuildRight Architecture Documentation

This directory contains architectural documentation for the BuildRight demo system.

---

## Documents

### **PRICING-STRATEGY.md**
Comprehensive documentation of BuildRight's ACO pricing strategy.

**Topics Covered:**
- Customer tier structure (Retail, Wholesale, Trade Professional, Production Builder)
- Price book definitions and multipliers
- Volume tier pricing rules
- Category-specific pricing (Structural Materials, Windows & Doors, Roofing)
- Persona-to-price-book mappings

**Key Concepts:**
- **Base Multipliers:** How each customer tier gets different base pricing
  - Retail: 1.0x (full price)
  - Wholesale: 0.85x (15% discount)
  - Trade Professional: 0.75x (25% discount)
  - Production Builder: 0.65x (35% discount)
  
- **Volume Tiers:** Quantity-based discounts within each price book
  - Structural Materials: 3% at 100+, 8% at 294+
  - Windows & Doors: 8% at 5+, 12% at 20+
  - Roofing: 7% at 10+, 12% at 50+
  - Default: 5% at 10+

**Related Files:**
- `../../definitions/aco/price-books.json` - Price book definitions
- `../../definitions/aco/pricing-rules.json` - Volume tier rules
- `../../generated/aco/prices.json` - Generated price entries

**Used By:**
- `commerce-demo-generator` - Generates ACO prices
- `commerce-demo-ingestion` - Imports prices to ACO
- `buildright-service` - Applies persona-based pricing

---

### **buildright-b2b-structure.md**
Documentation of BuildRight's B2B organizational structure.

**Topics Covered:**
- B2B company hierarchy
- Customer group assignments
- Shared catalog setup
- Catalog visibility rules
- MSI (Multi-Source Inventory) configuration

**Key Concepts:**
- **Company Structure:** How BuildRight B2B accounts are organized
- **Shared Catalogs:** Different product catalogs for different customer types
- **Catalog Views:** Persona-specific views (Retail, Production Builder, etc.)
- **Permissions:** Who can see and purchase what products

**Related Configuration:**
- Commerce B2B setup
- Shared catalog assignments
- Customer group to catalog view mappings

**Used By:**
- Commerce Admin - Manual B2B configuration
- `buildright-service` - Enforces B2B rules via headers

---

## Document History

These documents were migrated from `buildright-aco/docs/architecture/` during the repository consolidation (December 16, 2025).

**Migration Reason:**
- Consolidate BuildRight documentation with BuildRight data
- Align with 3-repo architecture
- Remove cross-repo dependencies

---

## Related Documentation

### In This Repository
- **[../schemas/](../schemas/)** - Commerce ACCS data schemas
- **[../../definitions/](../../definitions/)** - Data definitions (products, attributes, pricing)
- **[../../README.md](../../README.md)** - Main buildright-data README

### In Other Repositories
- **[commerce-demo-generator/docs/](../../commerce-demo-generator/docs/)** - Generator technical docs
- **[commerce-demo-ingestion/docs/](../../commerce-demo-ingestion/docs/)** - Ingestion guides
- **[buildright-eds/docs/](../../buildright-eds/docs/)** - Frontend documentation
- **[buildright-service/docs/](../../buildright-service/docs/)** - Backend service docs

---

## Updating Architecture Docs

### When to Update PRICING-STRATEGY.md

Update this document when:
- Adding new customer tiers
- Changing price book multipliers
- Modifying volume tier rules
- Adjusting category-specific pricing

**Remember to also update:**
- `../../definitions/aco/price-books.json`
- `../../definitions/aco/pricing-rules.json`
- Regenerate and redeploy ACO data

### When to Update buildright-b2b-structure.md

Update this document when:
- Changing B2B company structure
- Modifying shared catalog assignments
- Adding new customer groups
- Changing catalog visibility rules

**Remember to also update:**
- Commerce Admin configuration
- `buildright-service` persona logic if needed

---

## Additional Resources

### BuildRight System Architecture

For a complete understanding of how BuildRight works:

1. **Data Layer**
   - This repository (`buildright-data`) - Source of truth for all data
   - `commerce-demo-generator` - Transforms definitions to datapacks
   - `commerce-demo-ingestion` - Deploys to Commerce and ACO

2. **Backend Layer**
   - `buildright-service` - App Builder backend
   - Persona detection and routing
   - BOM generation
   - ACO GraphQL integration

3. **Frontend Layer**
   - `buildright-eds` - Edge Delivery Services storefront
   - Project builder
   - Commerce drop-ins
   - Persona-specific UI

### Key Data Flows

**Pricing Flow:**
```
price-books.json + pricing-rules.json
  ↓ (commerce-demo-generator)
generated/aco/prices.json
  ↓ (commerce-demo-ingestion)
ACO Catalog Service
  ↓ (buildright-service)
Frontend (persona-based pricing)
```

**BOM Generation Flow:**
```
templates.json + bom-product-criteria.json
  ↓ (buildright-service)
Generated BOM
  ↓ (buildright-eds)
BOM Review Page → Cart
```

---

**Last Updated:** December 16, 2025  
**Status:** ✅ Active - Used in production

