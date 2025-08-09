#!/usr/bin/env node
const assert = require('assert');
const { PLACES, listRegions, listChildren, getByCode, search, nearest } = require('../src/index');

console.log('🧪 Running somali-geo tests...\n');

// Test data loading
function testDataLoading() {
  console.log('📊 Testing data loading...');
  assert(Array.isArray(PLACES), 'PLACES should be an array');
  assert(PLACES.length > 0, 'PLACES should not be empty');
  
  // Check structure of first place
  const place = PLACES[0];
  assert(typeof place.code === 'string', 'Place should have code');
  assert(typeof place.name === 'string', 'Place should have name');
  assert(typeof place.type === 'string', 'Place should have type');
  
  // Check if coordinates exist (they might not be in the data yet)
  const placesWithCoords = PLACES.filter(p => typeof p.lat === 'number' && typeof p.lon === 'number');
  console.log(`📍 Found ${placesWithCoords.length}/${PLACES.length} places with coordinates`);
  
  console.log('✅ Data loading tests passed');
}

// Test listRegions
function testListRegions() {
  console.log('🗺️  Testing listRegions...');
  const regions = listRegions();
  assert(Array.isArray(regions), 'listRegions should return array');
  assert(regions.length > 0, 'Should have regions');
  assert(regions.every(r => r.type === 'region'), 'All results should be regions');
  
  console.log(`✅ Found ${regions.length} regions`);
}

// Test getByCode
function testGetByCode() {
  console.log('🔍 Testing getByCode...');
  
  // Test with existing code
  const regions = listRegions();
  if (regions.length > 0) {
    const region = getByCode(regions[0].code);
    assert(region !== null, 'Should find existing region');
    assert(region.code === regions[0].code, 'Should return correct region');
  }
  
  // Test case insensitive
  if (regions.length > 0) {
    const region = getByCode(regions[0].code.toLowerCase());
    assert(region !== null, 'Should be case insensitive');
  }
  
  // Test non-existent code
  const nonExistent = getByCode('INVALID-CODE');
  assert(nonExistent === null, 'Should return null for invalid code');
  
  console.log('✅ getByCode tests passed');
}

// Test search
function testSearch() {
  console.log('🔎 Testing search...');
  
  // Test empty query
  const emptyResults = search('');
  assert(Array.isArray(emptyResults), 'Should return array for empty query');
  assert(emptyResults.length === 0, 'Should return empty array for empty query');
  
  // Test search with common term
  const results = search('a');
  assert(Array.isArray(results), 'Should return array');
  assert(results.length > 0, 'Should find places with "a"');
  
  // Test case insensitive search
  const upperResults = search('A');
  assert(upperResults.length === results.length, 'Should be case insensitive');
  
  console.log(`✅ Search tests passed (found ${results.length} results for "a")`);
}

// Test listChildren
function testListChildren() {
  console.log('👨‍👩‍👧‍👦 Testing listChildren...');
  
  const regions = listRegions();
  if (regions.length > 0) {
    const children = listChildren(regions[0].code);
    assert(Array.isArray(children), 'Should return array');
    
    // All children should have the parent code
    children.forEach(child => {
      assert(child.parent === regions[0].code, 'Child should have correct parent');
    });
  }
  
  // Test non-existent parent
  const noChildren = listChildren('INVALID-PARENT');
  assert(Array.isArray(noChildren), 'Should return array for invalid parent');
  assert(noChildren.length === 0, 'Should return empty array for invalid parent');
  
  console.log('✅ listChildren tests passed');
}

// Test nearest function
function testNearest() {
  console.log('📍 Testing nearest...');
  
  // Check if any places have coordinates
  const placesWithCoords = PLACES.filter(p => typeof p.lat === 'number' && typeof p.lon === 'number');
  
  if (placesWithCoords.length === 0) {
    console.log('⚠️  No places with coordinates found, skipping nearest tests');
    return;
  }
  
  // Test basic nearest search (using Somalia center coordinates approximately)
  const results = nearest(5.0, 46.0);
  assert(Array.isArray(results), 'Should return array');
  assert(results.length <= 5, 'Should respect default limit');
  
  // Check that results have distance
  results.forEach(result => {
    assert(typeof result.distanceKm === 'number', 'Should have distanceKm');
    assert(result.distanceKm >= 0, 'Distance should be non-negative');
  });
  
  // Check sorting (distances should be ascending)
  for (let i = 1; i < results.length; i++) {
    assert(results[i].distanceKm >= results[i-1].distanceKm, 'Results should be sorted by distance');
  }
  
  // Test with limit
  const limitedResults = nearest(5.0, 46.0, { limit: 2 });
  assert(limitedResults.length <= 2, 'Should respect limit parameter');
  
  // Test with type filter if we have different types with coordinates
  const typesWithCoords = [...new Set(placesWithCoords.map(p => p.type))];
  if (typesWithCoords.length > 0) {
    const typeResults = nearest(5.0, 46.0, { type: typesWithCoords[0] });
    typeResults.forEach(result => {
      assert(result.type === typesWithCoords[0], 'Should filter by type');
    });
  }
  
  console.log(`✅ Nearest tests passed (found ${results.length} nearby places from ${placesWithCoords.length} places with coordinates)`);
}

// Test haversine distance calculation indirectly
function testDistanceCalculation() {
  console.log('📏 Testing distance calculation...');
  
  // Test same point (distance should be 0)
  const samePoint = nearest(2.05, 45.32, { limit: 1 });
  if (samePoint.length > 0) {
    // Find a place at exact coordinates if exists
    const exactMatch = PLACES.find(p => p.lat === 2.05 && p.lon === 45.32);
    if (exactMatch) {
      const result = nearest(2.05, 45.32, { limit: 10 });
      const exact = result.find(r => r.code === exactMatch.code);
      assert(exact.distanceKm === 0, 'Distance to same point should be 0');
    }
  }
  
  console.log('✅ Distance calculation tests passed');
}

// Run all tests
function runTests() {
  try {
    testDataLoading();
    testListRegions();
    testGetByCode();
    testSearch();
    testListChildren();
    testNearest();
    testDistanceCalculation();
    
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

runTests();