# Somalia Geographic Codes Explained 🗺️

This document explains the coding system used in the Somalia Geo library for identifying regions, districts, and cities.

## Code Structure

All place codes follow a hierarchical pattern:

```
SO-XX-name
│  │   │
│  │   └── Specific place name (districts/cities)
│  └────── Two-letter region abbreviation
└───────── Country code (Somalia)
```

## Region Codes (SO-XX)

### Northern Regions
- **SO-AW** - **Awdal** (Awdal Region)
- **SO-WO** - **Woqooyi Galbeed** (Maroodi Jeex/Northwest)
- **SO-TO** - **Togdheer** (Togdheer Region)
- **SO-SA** - **Sanaag** (Sanaag Region)
- **SO-SO** - **Sool** (Sool Region)

### Northeastern Regions  
- **SO-BR** - **Bari** (Bari Region)
- **SO-NU** - **Nugaal** (Nugaal Region)

### Central Regions
- **SO-MU** - **Mudug** (Mudug Region)
- **SO-GA** - **Galguduud** (Galguduud Region)
- **SO-HI** - **Hiiraan** (Hiiraan Region)

### Capital Region
- **SO-BN** - **Banaadir** (Banaadir/Mogadishu Region)

### Central-South Regions
- **SO-SD** - **Shabeellaha Dhexe** (Middle Shabelle)
- **SO-SH** - **Shabeellaha Hoose** (Lower Shabelle)

### Southern Regions
- **SO-BY** - **Bay** (Bay Region)
- **SO-BK** - **Bakool** (Bakool Region)
- **SO-GE** - **Gedo** (Gedo Region)
- **SO-JD** - **Jubbada Dhexe** (Middle Juba)
- **SO-JH** - **Jubbada Hoose** (Lower Juba)

## District/City Codes (SO-XX-name)

Districts and cities extend the region code with a descriptive name:

### Examples from Awdal Region (SO-AW):
- **SO-AW-borama** - Borama District
- **SO-AW-zeila** - Zeila District  
- **SO-AW-lughaya** - Lughaya District
- **SO-AW-baki** - Baki District
- **SO-AW-dilla** - Dilla District

### Examples from Banaadir Region (SO-BN):
- **SO-BN-bondhere** - Bondhere District
- **SO-BN-hamar-weyne** - Hamar Weyne District
- **SO-BN-shangani** - Shangani District
- **SO-BN-waberi** - Waberi District
- **SO-BN-yaqshid** - Yaqshid District

### Examples from Bari Region (SO-BR):
- **SO-BR-bosaso** - Bosaso District
- **SO-BR-qardho** - Qardho District
- **SO-BR-qandala** - Qandala District
- **SO-BR-iskushuban** - Iskushuban District

## Code Naming Conventions

### Region Code Abbreviations
The two-letter region codes are derived from:

1. **First letters of region name**: 
   - AW = **A**wdal + **W**
   - BR = **B**a**r**i
   - BY = **B**a**y**

2. **Phonetic abbreviations**:
   - BN = **B**a**n**aadir
   - MU = **Mu**dug
   - NU = **Nu**gaal

3. **Geographic descriptors**:
   - SH = **S**habeellaha **H**oose (Lower Shabelle)
   - SD = **S**habeellaha **D**hexe (Middle Shabelle)
   - JH = **J**ubbada **H**oose (Lower Juba)
   - JD = **J**ubbada **D**hexe (Middle Juba)

### District/City Naming
- Uses lowercase, hyphenated format
- Based on local Somali names
- Maintains original spelling where possible
- Multi-word names connected with hyphens

## Usage Examples

### Finding Places by Code
```javascript
const { getByCode } = require('somali-geo');

// Get a region
const awdal = getByCode('SO-AW');
console.log(awdal.name); // "Awdal"

// Get a district
const borama = getByCode('SO-AW-borama');
console.log(borama.name); // "Borama"
```

### Understanding Hierarchy
```javascript
const { listChildren } = require('somali-geo');

// Get all districts in Awdal region
const awdalDistricts = listChildren('SO-AW');
// Returns: Borama, Zeila, Lughaya, Baki, Dilla
```

### CLI Usage
```bash
# Get region info
somaligeo code SO-AW

# Get district info  
somaligeo code SO-AW-borama

# List all districts in a region
somaligeo children SO-AW
```

## Regional Breakdown

### By Geographic Area

**Somaliland (Northern)**
- SO-AW (Awdal), SO-WO (Woqooyi Galbeed), SO-TO (Togdheer)
- SO-SA (Sanaag), SO-SO (Sool)

**Puntland (Northeastern)**  
- SO-BR (Bari), SO-NU (Nugaal), SO-MU (Mudug - shared)

**Central Somalia**
- SO-GA (Galguduud), SO-HI (Hiiraan)
- SO-BN (Banaadir - Capital)

**South-Central Somalia**
- SO-SD (Middle Shabelle), SO-SH (Lower Shabelle)
- SO-BY (Bay), SO-BK (Bakool)

**Jubaland (Southern)**
- SO-GE (Gedo), SO-JD (Middle Juba), SO-JH (Lower Juba)

## Historical Context

The coding system reflects:
- **Administrative divisions** established by various Somali governments
- **Traditional regional names** in Somali language
- **Geographic features** (rivers: Shabelle, Juba)
- **Directional indicators** (Hoose = Lower, Dhexe = Middle, Galbeed = West)

## Notes for Developers

1. **Case Sensitivity**: Codes are case-insensitive in the API
2. **Validation**: Always validate codes exist before using
3. **Hierarchy**: Parent-child relationships are maintained via the `parent` field
4. **Extensibility**: New districts can be added following the same pattern

---

*This coding system provides a standardized way to reference any location in Somalia, from regions down to individual districts and cities.*