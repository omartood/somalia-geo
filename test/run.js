#!/usr/bin/env node
const { execSync } = require('child_process');

const tests = [
  { name: 'API Tests', file: 'test/index.test.js' },
  { name: 'CLI Tests', file: 'test/cli.test.js' }
];

console.log('🧪 Somalia Geo Test Runner\n');

let passed = 0;
let failed = 0;

for (const test of tests) {
  console.log(`Running ${test.name}...`);
  try {
    execSync(`node ${test.file}`, { stdio: 'inherit' });
    passed++;
    console.log(`✅ ${test.name} passed\n`);
  } catch (error) {
    failed++;
    console.log(`❌ ${test.name} failed\n`);
  }
}

console.log(`📊 Test Summary: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);