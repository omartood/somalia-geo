# Changelog

All notable changes to the Somalia Geo project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-08-10

### 🚀 Major Feature Release - Enhanced Search & Filtering

This release transforms Somalia Geo from a simple lookup tool into a comprehensive geographic analysis library.

### ✨ Added

#### New API Functions
- **`fuzzySearch(query, limit)`** - Typo-tolerant search powered by Fuse.js
  - Finds "Bosaso" even when you search for "Bosasso"
  - Includes relevance scoring for better results
  - Configurable result limits

- **`filter(criteria)`** - Advanced filtering system
  - Filter by type (region, district, city)
  - Filter by parent region
  - Filter by coordinate availability
  - Sort by any field (name, population, area)
  - Configurable sort order (asc/desc)
  - Result limiting and pagination

- **`getStats()`** - Comprehensive data statistics
  - Total place counts
  - Breakdown by type and region
  - Coverage statistics (coordinates, population, area)

- **`getLargestByPopulation(limit)`** - Population-based ranking
  - Ready for when population data is added
  - Configurable result limits

- **`getLargestByArea(limit)`** - Area-based ranking
  - Ready for when area data is added
  - Configurable result limits

#### Enhanced Existing Functions
- **`search(query, options)`** - Now supports fuzzy search option
  - Backward compatible with existing usage
  - New options: `{ fuzzy: boolean, limit: number }`

#### New CLI Commands
- **`somaligeo fuzzy <query> [limit]`** - Fuzzy search from command line
- **`somaligeo filter [options]`** - Advanced filtering with flags
  - `--type=<type>` - Filter by place type
  - `--region=<code>` - Filter by parent region
  - `--has-coords` - Only places with coordinates
  - `--limit=<number>` - Limit results
  - `--sort=<field>` - Sort by field
  - `--order=<asc|desc>` - Sort order
- **`somaligeo stats`** - Get data statistics
- **`somaligeo largest [population|area] [limit]`** - Get largest places

#### Developer Experience
- **Enhanced TypeScript definitions** - Complete type coverage for all new features
- **New interfaces**: `SearchOptions`, `FilterCriteria`, `Stats`
- **Updated Place interface** - Added optional fields for population, area, and search scores
- **Comprehensive documentation** - Updated README with all new features

### 🔧 Technical Improvements
- **Added Fuse.js dependency** - Powers intelligent fuzzy search
- **Enhanced CLI argument parsing** - Support for flag-based options
- **Better error handling** - Improved validation and user feedback
- **Modular architecture** - Clean separation of concerns

### 📦 Package Changes
- **Size**: 6.9 kB → 9.5 kB compressed
- **Unpacked size**: 24.9 kB → 35.4 kB
- **Dependencies**: 0 → 1 (fuse.js)
- **API functions**: 6 → 11 functions
- **CLI commands**: 6 → 10 commands

### 🎯 Future-Ready Features
- Population ranking system (ready for population data)
- Area ranking system (ready for area data)
- Coordinate filtering (ready for coordinate data)
- Extensible filtering system for additional metadata

### 📚 Documentation
- Updated README with comprehensive API documentation
- Added usage examples for all new features
- Enhanced CLI help with detailed command explanations
- Created CHANGELOG.md for version tracking

---

## [0.1.1] - 2025-08-09

### 🔧 Fixed
- **Updated repository URLs** - Fixed GitHub repository links in package.json
- **Corrected homepage URL** - Updated from placeholder to actual repository
- **Author information** - Updated maintainer details

### 📦 Package Metadata
- Fixed repository URL: `https://github.com/omartood/somalia-geo`
- Updated homepage link
- Corrected author information

---

## [0.1.0] - 2025-08-09

### 🎉 Initial Release

The first public release of Somalia Geo - a comprehensive JavaScript library and CLI tool for Somalia's administrative divisions.

### ✨ Features

#### Core API Functions
- **`listRegions()`** - Get all 18 regions of Somalia
- **`listChildren(parentCode)`** - Get districts/cities within a region
- **`getByCode(code)`** - Lookup places by their unique codes
- **`search(query)`** - Search places by name or aliases
- **`nearest(lat, lon, options)`** - Find nearest places (when coordinates available)

#### CLI Tool
- **`somaligeo regions`** - List all regions
- **`somaligeo children <code>`** - List children of a region
- **`somaligeo code <code>`** - Get place by code
- **`somaligeo search <query>`** - Search for places
- **`somaligeo near <lat> <lon> [options]`** - Find nearest places
- **`somaligeo help`** - Show usage instructions

#### Data Coverage
- **18 Regions** - Complete coverage of Somalia's administrative regions
- **135+ Places** - Regions, districts, and major cities
- **Hierarchical structure** - Proper parent-child relationships
- **Unique coding system** - `SO-XX-name` format for all places

#### Developer Experience
- **TypeScript support** - Full type definitions included
- **Zero runtime dependencies** - Lightweight and fast
- **Node.js 14+ compatibility** - Modern JavaScript features
- **Comprehensive tests** - Full test coverage for API and CLI
- **Professional documentation** - Complete README and code examples

#### Package Features
- **MIT License** - Open source and permissive
- **Small footprint** - Only 6.9 kB compressed
- **Global CLI installation** - `npm install -g somali-geo`
- **ESM/CommonJS compatible** - Works in all Node.js environments

### 📚 Documentation
- Comprehensive README with examples
- Complete API documentation
- CLI usage guide
- Code structure explanations (CODES.md)
- TypeScript definitions

### 🧪 Quality Assurance
- Full test suite for API functions
- CLI command testing
- Automated pre-publish testing
- Code quality checks

---

## Development Guidelines

### Version Numbering
- **Major (X.0.0)**: Breaking changes, major feature overhauls
- **Minor (0.X.0)**: New features, enhancements, non-breaking changes
- **Patch (0.0.X)**: Bug fixes, documentation updates, metadata changes

### Release Process
1. Update version in `package.json`
2. Update `CHANGELOG.md` with new changes
3. Run `npm test` to ensure all tests pass
4. Run `npm publish` to release to npm registry
5. Tag release in git repository

### Contributing
When contributing, please:
- Add entries to the "Unreleased" section
- Follow the existing changelog format
- Include both user-facing and technical changes
- Reference issue numbers when applicable

---

**Links:**
- [npm package](https://www.npmjs.com/package/somali-geo)
- [GitHub repository](https://github.com/omartood/somalia-geo)
- [Issues](https://github.com/omartood/somalia-geo/issues)