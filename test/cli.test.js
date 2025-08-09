#!/usr/bin/env node
const { execSync } = require('child_process');
const assert = require('assert');

console.log('🖥️  Testing CLI commands...\n');

function runCLI(args) {
  try {
    const result = execSync(`node src/cli.js ${args}`, { encoding: 'utf8' });
    return { success: true, output: result.trim() };
  } catch (error) {
    return { success: false, output: error.stdout || error.message };
  }
}

function testCLICommands() {
  console.log('🔧 Testing CLI help...');
  const help = runCLI('help');
  assert(help.success, 'Help command should work');
  assert(help.output.includes('somali-geo CLI'), 'Help should show CLI info');
  
  console.log('📋 Testing regions command...');
  const regions = runCLI('regions');
  assert(regions.success, 'Regions command should work');
  const regionData = JSON.parse(regions.output);
  assert(Array.isArray(regionData), 'Should return array');
  assert(regionData.length > 0, 'Should have regions');
  
  console.log('🔍 Testing code command...');
  const code = runCLI('code SO-AW');
  assert(code.success, 'Code command should work');
  const codeData = JSON.parse(code.output);
  assert(codeData.code === 'SO-AW', 'Should return correct region');
  
  console.log('🔎 Testing search command...');
  const search = runCLI('search Awdal');
  assert(search.success, 'Search command should work');
  const searchData = JSON.parse(search.output);
  assert(Array.isArray(searchData), 'Should return array');
  
  console.log('👨‍👩‍👧‍👦 Testing children command...');
  const children = runCLI('children SO-AW');
  assert(children.success, 'Children command should work');
  const childrenData = JSON.parse(children.output);
  assert(Array.isArray(childrenData), 'Should return array');
  
  console.log('❌ Testing invalid command...');
  const invalid = runCLI('invalid-command');
  assert(!invalid.success, 'Invalid command should fail');
  
  console.log('✅ All CLI tests passed!');
}

testCLICommands();