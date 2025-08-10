const fs = require("fs");
const path = require("path");
const Fuse = require("fuse.js");
const dataPath = path.join(__dirname, "..", "data", "places.json");
const PLACES = JSON.parse(fs.readFileSync(dataPath, "utf8"));

// Initialize fuzzy search
const fuseOptions = {
  keys: ['name', 'aliases'],
  threshold: 0.3, // 0 = exact match, 1 = match anything
  includeScore: true,
  minMatchCharLength: 2
};
const fuse = new Fuse(PLACES, fuseOptions);

function listRegions() {
  return PLACES.filter(p => p.type === "region");
}
function listChildren(parentCode) {
  return PLACES.filter(p => p.parent === parentCode);
}
function getByCode(code) {
  return PLACES.find(p => p.code.toLowerCase() === String(code).toLowerCase()) || null;
}
function search(q, options = {}) {
  if (!q) return [];
  
  const { fuzzy = true, limit = null } = options;
  
  if (fuzzy) {
    // Use fuzzy search for better results
    const results = fuse.search(q);
    const places = results.map(result => ({
      ...result.item,
      _score: result.score // Include relevance score
    }));
    return limit ? places.slice(0, limit) : places;
  } else {
    // Original exact search
    const s = q.toLowerCase();
    const results = PLACES.filter(p =>
      p.name.toLowerCase().includes(s) ||
      (p.aliases || []).some(a => a.toLowerCase().includes(s))
    );
    return limit ? results.slice(0, limit) : results;
  }
}

// New fuzzy search function for better discoverability
function fuzzySearch(q, limit = 10) {
  return search(q, { fuzzy: true, limit });
}

// Advanced filtering function
function filter(criteria = {}) {
  let results = [...PLACES];
  
  // Filter by type(s)
  if (criteria.type) {
    const types = Array.isArray(criteria.type) ? criteria.type : [criteria.type];
    results = results.filter(p => types.includes(p.type));
  }
  
  // Filter by parent region
  if (criteria.region) {
    results = results.filter(p => p.parent === criteria.region || p.code === criteria.region);
  }
  
  // Filter by population (if available)
  if (criteria.population) {
    if (criteria.population.min) {
      results = results.filter(p => p.population && p.population >= criteria.population.min);
    }
    if (criteria.population.max) {
      results = results.filter(p => p.population && p.population <= criteria.population.max);
    }
  }
  
  // Filter by area (if available)
  if (criteria.area) {
    if (criteria.area.min) {
      results = results.filter(p => p.area_km2 && p.area_km2 >= criteria.area.min);
    }
    if (criteria.area.max) {
      results = results.filter(p => p.area_km2 && p.area_km2 <= criteria.area.max);
    }
  }
  
  // Filter by coordinates availability
  if (criteria.hasCoordinates === true) {
    results = results.filter(p => typeof p.lat === 'number' && typeof p.lon === 'number');
  } else if (criteria.hasCoordinates === false) {
    results = results.filter(p => typeof p.lat !== 'number' || typeof p.lon !== 'number');
  }
  
  // Sort results
  if (criteria.sortBy) {
    results.sort((a, b) => {
      const aVal = a[criteria.sortBy];
      const bVal = b[criteria.sortBy];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return criteria.sortOrder === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return criteria.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      }
      
      return 0;
    });
  }
  
  // Limit results
  if (criteria.limit) {
    results = results.slice(0, criteria.limit);
  }
  
  return results;
}

// Get statistics about the data
function getStats() {
  const stats = {
    total: PLACES.length,
    byType: {},
    byRegion: {},
    withCoordinates: 0,
    withPopulation: 0,
    withArea: 0
  };
  
  PLACES.forEach(place => {
    // Count by type
    stats.byType[place.type] = (stats.byType[place.type] || 0) + 1;
    
    // Count by region (for districts/cities)
    if (place.parent) {
      stats.byRegion[place.parent] = (stats.byRegion[place.parent] || 0) + 1;
    }
    
    // Count places with coordinates
    if (typeof place.lat === 'number' && typeof place.lon === 'number') {
      stats.withCoordinates++;
    }
    
    // Count places with population data
    if (place.population) {
      stats.withPopulation++;
    }
    
    // Count places with area data
    if (place.area_km2) {
      stats.withArea++;
    }
  });
  
  return stats;
}

// Get largest places by population
function getLargestByPopulation(limit = 10) {
  return PLACES
    .filter(p => p.population && typeof p.population === 'number')
    .sort((a, b) => b.population - a.population)
    .slice(0, limit);
}

// Get places by area
function getLargestByArea(limit = 10) {
  return PLACES
    .filter(p => p.area_km2 && typeof p.area_km2 === 'number')
    .sort((a, b) => b.area_km2 - a.area_km2)
    .slice(0, limit);
}
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(a));
}
function nearest(lat, lon, { type=null, limit=5, radiusKm=null } = {}) {
  const withDist = PLACES
    .filter(p => typeof p.lat === "number" && typeof p.lon === "number" && (!type || p.type === type))
    .map(p => ({ ...p, distanceKm: haversineKm(lat, lon, p.lat, p.lon) }))
    .sort((a,b) => a.distanceKm - b.distanceKm);
  const within = radiusKm ? withDist.filter(p => p.distanceKm <= radiusKm) : withDist;
  return within.slice(0, limit);
}

module.exports = { 
  PLACES, 
  listRegions, 
  listChildren, 
  getByCode, 
  search, 
  fuzzySearch, 
  filter,
  getStats,
  getLargestByPopulation,
  getLargestByArea,
  nearest 
};
