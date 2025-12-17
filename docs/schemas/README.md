# Commerce Data Schemas

This directory contains JSON schemas for Adobe Commerce ACCS (Adobe Commerce Cloud Services) data import format.

---

## Purpose

These schemas define the structure and validation rules for Commerce datapack files. They are useful for:
- Understanding the expected format of Commerce import files
- Validating generated datapacks before import
- Reference when creating new data definitions
- IDE auto-completion and validation

---

## Schemas

### Core Entities

- **[products.json](./products.json)** - Product schema (simple, configurable, bundle, grouped)
- **[categories.json](./categories.json)** - Category tree structure
- **[product_attributes.json](./product_attributes.json)** - Product attribute definitions
- **[attribute_sets.json](./attribute_sets.json)** - Attribute set definitions
- **[attribute_assign_to_set.json](./attribute_assign_to_set.json)** - Attribute-to-set mappings
- **[stores.json](./stores.json)** - Website, store, store view structure

### Customer Management

- **[customers.json](./customers.json)** - Customer accounts
- **[customer_groups.json](./customer_groups.json)** - Customer group definitions

### B2B (Optional)

- **[b2b_companies.json](./b2b_companies.json)** - B2B company accounts
- **[b2b_companies_attributes.json](./b2b_companies_attributes.json)** - Company custom attributes
- **[b2b_shared_catalogs.json](./b2b_shared_catalogs.json)** - Shared catalog definitions
- **[b2b_shared_catalog_products.json](./b2b_shared_catalog_products.json)** - Product assignments to shared catalogs
- **[b2b_shared_catalog_categories.json](./b2b_shared_catalog_categories.json)** - Category assignments to shared catalogs
- **[b2b_shared_catalog_company_assignments.json](./b2b_shared_catalog_company_assignments.json)** - Company-to-catalog assignments

### Pricing & Promotions

- **[advanced_pricing.json](./advanced_pricing.json)** - Tier pricing and special prices
- **[cart_rules.json](./cart_rules.json)** - Shopping cart price rules
- **[coupons.json](./coupons.json)** - Coupon codes

### Other

- **[giftcards.json](./giftcards.json)** - Gift card products

---

## Usage Example

### Validating Generated Data

If you have a JSON schema validator (e.g., `ajv-cli`):

```bash
npm install -g ajv-cli
ajv validate -s docs/schemas/products.json -d generated/commerce/data/accs/accs_products.json
```

### IDE Integration

Many IDEs support JSON schemas for auto-completion and validation. Add a `$schema` reference to your JSON files:

```json
{
  "$schema": "../buildright-data/docs/schemas/products.json",
  "source": {
    "entity": "catalog_product",
    "items": [...]
  }
}
```

---

## Source

These schemas were extracted from the original `buildright-commerce` repository during the migration to the 3-repository architecture (December 2025).

They represent the Adobe Commerce ACCS Data Importer format requirements.

---

## Related Documentation

- **[ACCS Data Importer Guide](https://experienceleague.adobe.com/docs/commerce-admin/systems/data-transfer/data-import.html)** - Official Adobe documentation
- **[commerce-demo-generator](../../commerce-demo-generator/)** - Tool that generates data in this format
- **[commerce-demo-ingestion](../../commerce-demo-ingestion/)** - Tool that imports data using these schemas

---

**Note:** These are reference schemas. The actual data generation happens in `commerce-demo-generator` and follows these structures.

