# ACO Category Filtering Implementation

## Overview

This document describes the category filtering approach for Adobe Commerce Optimizer (ACO) in the BuildRight demo system.

## Architecture Decision

**ACO is the source of truth for products and pricing; Categories are shared.**

- ACO controls product visibility (via Catalog Views) and pricing (via Price Books)
- Categories are the same across all personas - the category tree doesn't vary
- We use the ACO Categories API for navigation/routing and display names
- Products store category **slugs** (not display names) for filtering

## Why Custom Attributes (Not Native Category Filters)

ACO has native `categoryPath`, `categories`, and `categoryIds` filters, but these:
- Only populate when connected to Commerce Admin via SaaS Catalog Sync
- Would tie ACO to Commerce's less flexible category structure
- Don't work with pure ACO Data Ingestion API

**Solution: Dyson Pattern** - Use custom product attributes for category filtering.

## Implementation

### Product Attributes

Products have two category-related attributes with **slugs** (URL-friendly identifiers):

```json
{
  "sku": "STR-49C283DE",
  "attributes": [
    { "code": "category", "values": ["structural-materials"] },
    { "code": "subcategory", "values": ["lumber"] }
  ]
}
```

### Why Slugs (Not Display Names)

Storing slugs instead of display names provides several benefits:

1. **No mapping required** - URL slugs match product attribute values directly
2. **No hardcoded lookup tables** - Eliminates sync issues between code and data
3. **Single source for display names** - Categories API provides display names for UI
4. **Simpler resolver** - No slug-to-display-name conversion logic

### Metadata

Both attributes are defined with `type: 'select'` which sets `filterable: true`:

```json
{
  "attributeId": "category",
  "type": "select",
  "label": "Category"
}
```

```json
{
  "attributeId": "subcategory",
  "type": "select",
  "label": "Subcategory"
}
```

### Mesh Resolver

The `dropin-search.js` resolver transforms dropin filter requests:

1. **Input**: Dropin sends `categoryUrlKey` with slug value
2. **Path Depth Detection**:
   - Single segment (e.g., "structural-materials") -> top-level **category**
   - Nested path (e.g., "structural-materials/lumber") -> **subcategory** (leaf)
3. **Direct mapping** - Slug passes through without conversion

```javascript
// dropin-search.js - simplified, no lookup table needed
function transformDropinFilter(filter) {
  return filter.map(f => {
    if (f.attribute === 'categoryUrlKey') {
      const transformCategoryValue = (val) => {
        if (!val) return { attribute: 'category', value: val };
        const segments = val.split('/');
        if (segments.length === 1) {
          // Top-level: filter by category attribute with slug
          return { attribute: 'category', value: segments[0] };
        } else {
          // Nested: filter by subcategory with leaf slug
          return { attribute: 'subcategory', value: segments[segments.length - 1] };
        }
      };

      if (f.eq !== undefined) {
        const { attribute, value } = transformCategoryValue(f.eq);
        return { attribute, eq: value };
      }
      // ... handle 'in' and 'range' similarly
    }
    return f;
  });
}
```

### Display Names

Display names for UI rendering come from the **Categories API**:

```javascript
// Frontend fetches categories once and caches them
const categories = await meshClient.getCategories();
// Returns: [{ slug: 'structural-materials', name: 'Structural Materials', ... }]

// Look up display name when needed
const displayName = categories.find(c => c.slug === 'structural-materials')?.name;
// Returns: 'Structural Materials'
```

## Data Flow

**Top-level Category:**
```
URL: /catalog?category=structural-materials
         |
Dropin: filter: [{attribute: "categoryUrlKey", eq: "structural-materials"}]
         |
Mesh Resolver: transforms to [{attribute: "category", eq: "structural-materials"}]
         |
ACO: filters products by category attribute (slug value)
         |
Result: 15 products in Structural Materials
         |
UI: Fetches display name from Categories API -> "Structural Materials"
```

**Nested Subcategory:**
```
URL: /catalog?category=structural-materials/lumber
         |
Dropin: filter: [{attribute: "categoryUrlKey", eq: "structural-materials/lumber"}]
         |
Mesh Resolver: transforms to [{attribute: "subcategory", eq: "lumber"}]
         |
ACO: filters products by subcategory attribute (slug value)
         |
Result: 8 lumber products
         |
UI: Fetches display name from Categories API -> "Lumber"
```

## Files Modified

| File | Purpose |
|------|---------|
| `commerce-demo-generator/generators/generate-aco.js` | Adds `category`/`subcategory` attributes with slug values |
| `buildright-service/mesh/resolvers-src/dropin-search.js` | Transforms `categoryUrlKey` to category/subcategory filter |
| `buildright-data/generated/aco/products.json` | Generated products with category slug attributes |
| `buildright-data/generated/aco/metadata.json` | Metadata including category/subcategory definitions |

## Testing

Query ACO through the mesh:
```graphql
query {
  productSearch(
    phrase: ""
    filter: [{attribute: "subcategory", eq: "lumber"}]
    page_size: 5
  ) {
    total_count
    items { productView { sku name } }
  }
}
```

Expected: Returns products in the Lumber subcategory.

## Key Benefits of Slug-Based Approach

1. **No hardcoded mapping** - Eliminates the `CATEGORY_SLUG_MAP` lookup table
2. **Handles special characters** - "Framing & Drywall" works without conversion
3. **Single source of truth** - Categories API provides display names
4. **Simpler code** - No `slugToDisplayName()` function needed
5. **Easier maintenance** - Add categories in ACO, no code changes required

## Reference

This implementation follows the **Dyson pattern** observed in Adobe's reference implementation, which uses custom `category`/`subcategory` attributes rather than native ACO category filters. The key improvement is storing slugs (not display names) to eliminate the need for runtime slug-to-display-name conversion.

## Related Documentation

- ACO Categories API (`/v1/catalog/categories`) provides the category tree with display names
- Native category filters (`categoryPath`, `categories`) require Commerce Admin sync
- Catalog Views and Price Books handle persona-specific product/pricing visibility
