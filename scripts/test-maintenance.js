#!/usr/bin/env node

/**
 * ChompChew Test Maintenance Script
 * Comprehensive test suite management and optimization
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// Test categories for organized execution
const TEST_CATEGORIES = {
  unit: [
    'tests/lib/',
    'tests/components/',
    'tests/services/',
    'tests/validation/'
  ],
  integration: [
    'tests/integration/',
    'tests/api/'
  ],
  infrastructure: [
    'tests/infrastructure/',
    'tests/middleware/'
  ],
  security: [
    'tests/security/',
    'tests/validation/inputValidation.test.ts'
  ],
  performance: [
    'tests/performance/'
  ],
  e2e: [
    'tests/e2e/'
  ]
};

// Priority test suites for CI/CD
const CRITICAL_TESTS = [
  'tests/lib/auth.test.ts',
  'tests/lib/openai.test.ts',
  'tests/infrastructure/rateLimiter.test.ts',
  'tests/security/dataValidation.test.ts',
  'tests/integration/database.test.ts'
];

const COMMANDS = {
  // Run specific test categories
  unit: () => runTests(TEST_CATEGORIES.unit, 'Unit Tests'),
  integration: () => runTests(TEST_CATEGORIES.integration, 'Integration Tests'),
  infrastructure: () => runTests(TEST_CATEGORIES.infrastructure, 'Infrastructure Tests'),
  security: () => runTests(TEST_CATEGORIES.security, 'Security Tests'),
  performance: () => runTests(TEST_CATEGORIES.performance, 'Performance Tests'),
  e2e: () => runTests(TEST_CATEGORIES.e2e, 'E2E Tests'),
  
  // Critical tests for CI/CD
  critical: () => runTests(CRITICAL_TESTS, 'Critical Tests'),
  
  // Full test suite
  all: () => runCommand('npm test -- --run', 'Full Test Suite'),
  
  // Coverage reports
  coverage: () => runCommand('npm test -- --coverage --run', 'Coverage Report'),
  
  // Watch mode for development
  watch: () => runCommand('npm test -- --watch', 'Watch Mode'),
  
  // Test health check
  health: () => testHealth(),
  
  // Performance benchmark
  benchmark: () => benchmarkTests(),
  
  // Clean test artifacts
  clean: () => cleanTestArtifacts(),
  
  // Generate test report
  report: () => generateTestReport()
};

function runTests(patterns, description) {
  console.log(`\n🧪 Running ${description}...`);
  const patternStr = Array.isArray(patterns) ? patterns.join(' ') : patterns;
  runCommand(`npm test -- --run ${patternStr}`, description);
}

function runCommand(command, description) {
  console.log(`\n▶️  ${description}`);
  console.log(`Command: ${command}\n`);
  
  try {
    const output = execSync(command, { 
      stdio: 'inherit', 
      cwd: process.cwd(),
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    console.log(`\n✅ ${description} completed successfully`);
    return output;
  } catch (error) {
    console.error(`\n❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

function testHealth() {
  console.log('\n🏥 Running Test Health Check...');
  
  const healthChecks = [
    {
      name: 'Test Configuration',
      check: () => fs.existsSync('tests/setup/vitest.config.ts')
    },
    {
      name: 'Test Setup Files',
      check: () => fs.existsSync('tests/setup/test-setup.ts')
    },
    {
      name: 'Mock Handlers',
      check: () => fs.existsSync('tests/mocks/handlers.ts')
    },
    {
      name: 'Test Utilities',
      check: () => fs.existsSync('tests/utils/testHelpers.ts')
    },
    {
      name: 'Critical Test Files',
      check: () => CRITICAL_TESTS.every(file => fs.existsSync(file))
    }
  ];
  
  console.log('\n📋 Health Check Results:');
  healthChecks.forEach(({ name, check }) => {
    const status = check() ? '✅' : '❌';
    console.log(`${status} ${name}`);
  });
  
  // Count test files
  const testFiles = countTestFiles();
  console.log(`\n📊 Test Suite Statistics:`);
  console.log(`• Total test files: ${testFiles.total}`);
  console.log(`• Unit tests: ${testFiles.unit}`);
  console.log(`• Integration tests: ${testFiles.integration}`);
  console.log(`• Infrastructure tests: ${testFiles.infrastructure}`);
  console.log(`• Security tests: ${testFiles.security}`);
  console.log(`• Performance tests: ${testFiles.performance}`);
}

function countTestFiles() {
  const stats = {
    total: 0,
    unit: 0,
    integration: 0,
    infrastructure: 0,
    security: 0,
    performance: 0
  };
  
  function countInDir(dir, category) {
    try {
      const files = fs.readdirSync(dir);
      let count = 0;
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          count += countInDir(filePath, category);
        } else if (file.endsWith('.test.ts') || file.endsWith('.test.tsx') || file.endsWith('.spec.ts')) {
          count++;
          stats.total++;
        }
      });
      
      return count;
    } catch {
      return 0;
    }
  }
  
  // Count by category
  stats.unit = countInDir('tests/lib', 'unit') + countInDir('tests/components', 'unit') + countInDir('tests/services', 'unit');
  stats.integration = countInDir('tests/integration', 'integration');
  stats.infrastructure = countInDir('tests/infrastructure', 'infrastructure');
  stats.security = countInDir('tests/security', 'security');
  stats.performance = countInDir('tests/performance', 'performance');
  
  return stats;
}

function benchmarkTests() {
  console.log('\n⏱️  Running Test Performance Benchmark...');
  
  const benchmarks = [
    { name: 'Critical Tests', command: 'critical' },
    { name: 'Unit Tests', command: 'unit' },
    { name: 'Integration Tests', command: 'integration' }
  ];
  
  benchmarks.forEach(({ name, command }) => {
    console.log(`\n📊 Benchmarking ${name}...`);
    const startTime = Date.now();
    
    try {
      execSync(`node ${__filename} ${command}`, { stdio: 'pipe' });
      const duration = Date.now() - startTime;
      console.log(`✅ ${name}: ${duration}ms`);
    } catch (error) {
      console.log(`❌ ${name}: Failed`);
    }
  });
}

function cleanTestArtifacts() {
  console.log('\n🧹 Cleaning test artifacts...');
  
  const artifactDirs = [
    'coverage',
    'test-results',
    'playwright-report',
    '.nyc_output'
  ];
  
  artifactDirs.forEach(dir => {
    try {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`✅ Cleaned ${dir}`);
      }
    } catch (error) {
      console.log(`❌ Failed to clean ${dir}:`, error.message);
    }
  });
  
  console.log('🎉 Test artifacts cleaned');
}

function generateTestReport() {
  console.log('\n📝 Generating comprehensive test report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    testSuite: 'ChompChew Comprehensive Test Suite',
    categories: Object.keys(TEST_CATEGORIES),
    criticalTests: CRITICAL_TESTS.length,
    healthStatus: 'Generated by test-maintenance script'
  };
  
  const reportPath = 'test-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`✅ Test report generated: ${reportPath}`);
}

function showUsage() {
  console.log(`
🧪 ChompChew Test Maintenance Script

Usage: node scripts/test-maintenance.js <command>

Commands:
  unit          Run unit tests (lib, components, services)
  integration   Run integration tests
  infrastructure Run infrastructure tests (Redis, rate limiting)
  security      Run security and validation tests
  performance   Run performance tests
  e2e          Run end-to-end tests
  critical     Run critical tests for CI/CD
  all          Run full test suite
  coverage     Generate coverage report
  watch        Run tests in watch mode
  health       Check test suite health
  benchmark    Benchmark test performance
  clean        Clean test artifacts
  report       Generate test report
  help         Show this help message

Examples:
  node scripts/test-maintenance.js critical
  node scripts/test-maintenance.js security
  node scripts/test-maintenance.js health
  node scripts/test-maintenance.js coverage
`);
}

// Main execution
const command = process.argv[2];

if (!command || command === 'help') {
  showUsage();
  process.exit(0);
}

if (COMMANDS[command]) {
  console.log(`\n🚀 ChompChew Test Suite - ${command.toUpperCase()}`);
  COMMANDS[command]();
} else {
  console.error(`\n❌ Unknown command: ${command}`);
  showUsage();
  process.exit(1);
} 