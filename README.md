# Somalia Geo 🇸🇴

A lightweight JavaScript library and CLI tool for Somalia's administrative divisions and geographic data. Get regions, districts, cities, and their relationships with a simple API.

[![npm version](https://img.shields.io/npm/v/somali-geo.svg)](https://www.npmjs.com/package/somali-geo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14-brightgreen.svg)](https://nodejs.org/)

## Features

- 🗺️ **Complete coverage**: 18 regions, 100+ districts and cities
- 🔍 **Smart search**: Find places by name or aliases with fuzzy matching
- 🎯 **Advanced filtering**: Filter by type, region, population, area, and more
- 🏗️ **Hierarchical data**: Navigate parent-child relationships
- 📍 **Distance calculations**: Find nearest places (when coordinates available)
- 📊 **Data statistics**: Get insights about regions, populations, and coverage
- 🖥️ **Enhanced CLI**: Powerful command-line interface with advanced features
- 📦 **Lightweight**: Minimal dependencies, fast loading
- 🔧 **TypeScript support**: Full type definitions included
- 🚀 **Fuzzy search**: Typo-tolerant search powered by Fuse.js

## Installation

```bash
npm install somali-geo
```

Or use globally for CLI access:

```bash
npm install -g somali-geo
```

## Quick Start

### JavaScript API

```javascript
const { 
  listRegions, 
  search, 
  fuzzySearch, 
  filter, 
  getByCode, 
  listChildren,
  getStats,
  getLargestByPopulation 
} = require("somali-geo");

// Get all regions
const regions = listRegions();
console.log(regions.length); // 18

// Search for places (exact match)
const results = search("Bosaso");
console.log(results[0].name); // "Bosaso"

// Fuzzy search (typo-tolerant)
const fuzzyResults = fuzzySearch("Bosasso", 5); // Finds "Bosaso"
console.log(fuzzyResults[0].name); // "Bosaso"

// Advanced filtering
const districts = filter({
  type: 'district',
  region: 'SO-BN',
  limit: 5
});

// Get place by code
const awdal = getByCode("SO-AW");
console.log(awdal.name); // "Awdal"

// Get statistics
const stats = getStats();
console.log(`Total places: ${stats.total}`); // 135
```

### CLI Usage

```bash
# Basic commands
somaligeo regions                    # List all regions
somaligeo search Mogadishu          # Search for places
somaligeo code SO-BN                # Get place by code
somaligeo children SO-AW            # List districts in a region

# Enhanced commands
somaligeo fuzzy "Mogadisho" 5       # Fuzzy search (finds "Mogadishu")
somaligeo filter --type=district --region=SO-BN --limit=5
somaligeo stats                     # Get data statistics
somaligeo largest population 10    # Top 10 by population
somaligeo near 2.05 45.32 city 5 100  # Find nearest places
```

## API Reference

### Core Functions

#### `listRegions()`
Returns all 18 regions of Somalia.

```javascript
const regions = listRegions();
// Returns: Array of region objects
```

#### `search(query, options)`
Search places by name or aliases (case-insensitive).

```javascript
const results = search("Bosaso");
// Returns: Array of matching places

// With options
const results = search("Bosaso", { fuzzy: true, limit: 5 });
```

#### `fuzzySearch(query, limit)`
Typo-tolerant search powered by Fuse.js.

```javascript
const results = fuzzySearch("Bosasso", 5); // Finds "Bosaso"
// Returns: Array of places with relevance scores
```

#### `filter(criteria)`
Advanced filtering with multiple criteria.

```javascript
const districts = filter({
  type: ['district', 'city'],
  region: 'SO-BN',
  hasCoordinates: true,
  sortBy: 'name',
  sortOrder: 'asc',
  limit: 10
});
// Returns: Filtered and sorted array of places
```

#### `getByCode(code)`
Get a specific place by its code (case-insensitive).

```javascript
const place = getByCode("SO-AW");
// Returns: Place object or null
```

#### `listChildren(parentCode)`
Get all child places (districts/cities) of a parent region.

```javascript
const districts = listChildren("SO-BN");
// Returns: Array of child places
```

#### `getStats()`
Get comprehensive statistics about the dataset.

```javascript
const stats = getStats();
// Returns: Object with totals, breakdowns by type/region, etc.
```

#### `getLargestByPopulation(limit)`
Get places sorted by population (when available).

```javascript
const largest = getLargestByPopulation(10);
// Returns: Top 10 places by population
```

#### `getLargestByArea(limit)`
Get places sorted by area (when available).

```javascript
const largest = getLargestByArea(5);
// Returns: Top 5 places by area
```

#### `nearest(lat, lon, options)`
Find nearest places to given coordinates.

```javascript
const nearby = nearest(2.05, 45.32, {
  type: "city", // Filter by type (optional)
  limit: 5, // Max results (default: 5)
  radiusKm: 100, // Max distance in km (optional)
});
// Returns: Array of places with distance
```

### Data Structure

Each place object contains:

```typescript
interface Place {
  code: string; // Unique identifier (e.g., "SO-AW" for Awdal region)
  name: string; // Place name (e.g., "Awdal")
  type: PlaceType; // "region" | "district" | "city" | "town" | "village"
  parent: string | null; // Parent place code or null for regions
  lat?: number; // Latitude (when available)
  lon?: number; // Longitude (when available)
  aliases?: string[]; // Alternative names
}
```

**Code Format**: `SO-XX-name` where `SO` = Somalia, `XX` = region abbreviation, `name` = place name.
See [CODES.md](CODES.md) for complete code explanations.

## CLI Commands

### Basic Commands

```bash
# Show help
somaligeo help

# List all regions
somaligeo regions

# Search places
somaligeo search <query>

# Get place by code
somaligeo code <CODE>

# List children of a place
somaligeo children <PARENT_CODE>
```

### Advanced Commands

```bash
# Find nearest places
somaligeo near <lat> <lon> [type] [limit] [radiusKm]

# Examples
somaligeo near 2.05 45.32           # 5 nearest places
somaligeo near 2.05 45.32 city      # Nearest cities only
somaligeo near 2.05 45.32 city 3    # 3 nearest cities
somaligeo near 2.05 45.32 city 3 50 # Within 50km radius
```

## Examples

### Find all districts in Banaadir region (Mogadishu area)

```javascript
const { listChildren } = require("somali-geo");

const mogadishuDistricts = listChildren("SO-BN");
console.log(`Mogadishu has ${mogadishuDistricts.length} districts:`);
mogadishuDistricts.forEach((district) => {
  console.log(`- ${district.name} (${district.code})`);
});
```

### Search and explore hierarchy

```javascript
const { search, listChildren } = require("somali-geo");

// Find a region
const results = search("Awdal");
const awdal = results[0];

// Get its districts
const districts = listChildren(awdal.code);
console.log(`${awdal.name} region has ${districts.length} districts`);
```

### CLI workflow

```bash
# Find a region
somaligeo search Awdal

# Get its code from results: SO-AW
# List its districts
somaligeo children SO-AW

# Get details of a specific district
somaligeo code SO-AW-borama
```

## Data Coverage

- **18 Regions**: All major administrative regions
- **100+ Districts**: Comprehensive district coverage
- **Cities & Towns**: Major urban centers
- **Hierarchical**: Proper parent-child relationships

> 📋 **Need help with codes?** See [CODES.md](CODES.md) for detailed explanations of all region and district codes.

### Regions Included

- Awdal, Bakool, Banaadir, Bari, Bay
- Galguduud, Gedo, Hiiraan
- Jubbada Hoose, Jubbada Dhexe
- Mudug, Nugaal, Sanaag, Sool
- Shabeellaha Hoose, Shabeellaha Dhexe
- Togdheer, Woqooyi Galbeed

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:api    # API tests only
npm run test:cli    # CLI tests only
```

### Project Structure

```
somali-geo/
├── src/
│   ├── index.js      # Main API
│   ├── index.d.ts    # TypeScript definitions
│   └── cli.js        # CLI tool
├── data/
│   └── places.json   # Geographic data
├── test/
│   ├── index.test.js # API tests
│   ├── cli.test.js   # CLI tests
│   └── run.js        # Test runner
└── package.json
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Adding Data

To add new places or coordinates:

1. Edit `data/places.json`
2. Follow the existing structure
3. Run tests to ensure data integrity
4. Submit a pull request

### Code Style

- Use Node.js built-in modules when possible
- Keep dependencies minimal
- Follow existing code patterns
- Add tests for new features

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

### v0.1.0

- Initial release
- Complete administrative divisions data
- CLI tool with all basic commands
- TypeScript support
- Comprehensive test suite

---

**Made with ❤️ for the Somali developer community**
