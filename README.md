# BuildRight Demo Data

This repository contains all data for the BuildRight Commerce demo: source definitions, generated datapacks, and media assets.

## Structure

```
buildright-data/
├── definitions/              # Source data definitions
│   ├── project.json         # BuildRight project configuration
│   ├── products/            # Product catalog definitions
│   ├── categories/          # Category tree structure
│   ├── customers/           # Customer groups and demo customers
│   └── attributes/          # Product and customer attributes
├── media/                   # Media assets
│   └── images/              
│       └── products/        # Product images
└── generated/               # Generated datapacks (committed)
    ├── commerce/            # ACCS format for Adobe Commerce
    │   ├── data/accs/       # JSON data files
    │   └── media/           # Product images for import
    └── aco/                 # ACO format for Adobe Commerce Optimizer
```

## Usage

### Viewing Source Data

The `definitions/` directory contains human-readable JSON files that define:

- **project.json**: BuildRight project configuration (store codes, prefixes, etc.)
- **products/catalog.json**: 281 product definitions
- **categories/category-tree.json**: Category hierarchy
- **customers/demo-customers.json**: Demo customer data
- **attributes/**: Custom product and customer attributes

### Using Generated Datapacks

The `generated/` directory contains ready-to-import datapacks:

**Commerce (ACCS format):**
- Located in `generated/commerce/`
- Use with `commerce-demo-ingestion` repository
- Run: `npm run import:commerce`

**ACO format:**
- Located in `generated/aco/`
- Use with `commerce-demo-ingestion` repository  
- Run: `npm run import:aco`

## Regenerating Datapacks

To regenerate the datapacks after modifying source data:

1. Clone `commerce-demo-generator` repository
2. Run the generator pointing to this repository:

```bash
cd ../commerce-demo-generator
npm run generate:all -- --data-repo=../buildright-data
```

3. Commit the updated `generated/` files

## Project Configuration

BuildRight uses the following configuration (see `definitions/project.json`):

- **Website Code**: `buildright`
- **Store Code**: `buildright_store`
- **Store View Code**: `buildright_us`
- **Root Category**: `BuildRight Catalog`
- **Product Attribute Prefix**: `br_`
- **Customer Attribute Prefix**: `aco_`

## Data Statistics

- **Products**: 281 total (146 simple, 15 configurable with 120 variants)
- **Categories**: 37 categories across multiple levels
- **Attributes**: 42 custom product attributes
- **Customer Groups**: 5 customer segments
- **Demo Customers**: 5 sample customers

## Modifying Data

To modify the BuildRight demo:

1. Edit files in `definitions/`
2. Update images in `media/images/products/` if needed
3. Regenerate datapacks using `commerce-demo-generator`
4. Test with `commerce-demo-ingestion`
5. Commit all changes

## Version Control

Both source definitions AND generated artifacts are version controlled in this repository. This ensures:

- Reproducible imports
- Known-good datapacks
- Easy rollback if needed
- Clear audit trail of data changes

## Related Repositories

- **commerce-demo-generator**: Generates datapacks from this data
- **commerce-demo-ingestion**: Imports datapacks to Commerce/ACO
- **buildright-aco**: ACO-specific configuration and scripts
- **buildright-eds**: Edge Delivery Services implementation

## License

Proprietary - Adobe Internal Demo Data

