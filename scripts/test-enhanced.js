#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function execCommand(command, description) {
  log(`\n${description}`, 'cyan')
  log(`Running: ${command}`, 'blue')
  
  try {
    const output = execSync(command, { 
      stdio: 'inherit',
      encoding: 'utf8',
      timeout: 300000 // 5 minute timeout
    })
    log(`✅ ${description} completed successfully`, 'green')
    return true
  } catch (error) {
    log(`❌ ${description} failed`, 'red')
    log(`Error: ${error.message}`, 'red')
    return false
  }
}

function createReportsDirectory() {
  const reportsDir = path.join(process.cwd(), 'test-reports')
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true })
  }
  return reportsDir
}

function generateSummaryReport(results) {
  const reportsDir = createReportsDirectory()
  const timestamp = new Date().toISOString()
  
  const summary = {
    timestamp,
    totalTests: results.length,
    passed: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    testResults: results,
    qualityScore: calculateQualityScore(results)
  }

  const reportPath = path.join(reportsDir, 'enhanced-test-summary.json')
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2))
  
  return summary
}

function calculateQualityScore(results) {
  const weights = {
    'Property-Based Tests': 20,
    'Contract Tests': 15,
    'Chaos Engineering': 20,
    'Performance Regression': 15,
    'Visual Regression': 10,
    'Mutation Testing': 20
  }
  
  let totalWeight = 0
  let achievedWeight = 0
  
  results.forEach(result => {
    const weight = weights[result.name] || 10
    totalWeight += weight
    if (result.success) {
      achievedWeight += weight
    }
  })
  
  return Math.round((achievedWeight / totalWeight) * 100)
}

async function runEnhancedTests() {
  log('🚀 Starting Enhanced Test Suite for ChompChew', 'bright')
  log('=========================================', 'bright')
  
  createReportsDirectory()
  
  const testSuites = [
    {
      name: 'Property-Based Tests',
      command: 'npm run test:property',
      description: 'Running property-based tests with fast-check'
    },
    {
      name: 'Contract Tests', 
      command: 'npm run test:contract',
      description: 'Running API contract tests with Pact'
    },
    {
      name: 'Chaos Engineering',
      command: 'npm run test:chaos',
      description: 'Running chaos engineering tests for resilience'
    },
    {
      name: 'Performance Regression',
      command: 'npm run test:performance',
      description: 'Running performance regression tests'
    },
    {
      name: 'Visual Regression',
      command: 'npm run test:visual',
      description: 'Running visual regression tests with Chromatic'
    },
    {
      name: 'Mutation Testing',
      command: 'npm run test:mutation',
      description: 'Running mutation tests to validate test quality'
    }
  ]

  const results = []
  
  for (const suite of testSuites) {
    const success = execCommand(suite.command, suite.description)
    results.push({
      name: suite.name,
      command: suite.command,
      success,
      timestamp: new Date().toISOString()
    })
  }

  // Generate summary report
  const summary = generateSummaryReport(results)
  
  log('\n📊 Enhanced Test Suite Summary', 'bright')
  log('===============================', 'bright')
  log(`Total Test Suites: ${summary.totalTests}`, 'blue')
  log(`Passed: ${summary.passed}`, 'green')
  log(`Failed: ${summary.failed}`, 'red')
  log(`Quality Score: ${summary.qualityScore}%`, summary.qualityScore >= 80 ? 'green' : summary.qualityScore >= 60 ? 'yellow' : 'red')
  
  // Detailed results
  log('\n📋 Detailed Results:', 'bright')
  results.forEach(result => {
    const status = result.success ? '✅' : '❌'
    const color = result.success ? 'green' : 'red'
    log(`${status} ${result.name}`, color)
  })

  // Recommendations
  log('\n💡 Recommendations:', 'bright')
  if (summary.qualityScore >= 90) {
    log('🏆 Excellent! Your test suite is world-class.', 'green')
  } else if (summary.qualityScore >= 80) {
    log('👍 Great job! Minor improvements could make it even better.', 'yellow')
  } else if (summary.qualityScore >= 60) {
    log('⚠️  Good foundation, but several areas need improvement.', 'yellow')
  } else {
    log('🔴 Critical: Significant testing improvements needed.', 'red')
  }

  if (summary.failed > 0) {
    log('\n🔧 Failed Tests Need Attention:', 'red')
    results.filter(r => !r.success).forEach(result => {
      log(`• ${result.name}: Check configuration and dependencies`, 'red')
    })
  }

  log(`\n📄 Full report saved to: test-reports/enhanced-test-summary.json`, 'blue')
  
  // Exit with error code if critical tests failed
  const criticalTests = ['Property-Based Tests', 'Chaos Engineering', 'Performance Regression']
  const criticalFailures = results.filter(r => !r.success && criticalTests.includes(r.name))
  
  if (criticalFailures.length > 0) {
    log('\n🚨 Critical test failures detected. CI/CD should fail.', 'red')
    process.exit(1)
  }
  
  log('\n🎉 Enhanced test suite completed!', 'green')
  process.exit(0)
}

// Handle command line arguments
const args = process.argv.slice(2)
const command = args[0]

switch (command) {
  case 'help':
  case '--help':
  case '-h':
    log('Enhanced Test Suite for ChompChew', 'bright')
    log('Usage: node scripts/test-enhanced.js [command]', 'blue')
    log('\nCommands:', 'bright')
    log('  (no args)  Run all enhanced tests', 'blue')
    log('  help       Show this help message', 'blue')
    log('  summary    Show last test summary', 'blue')
    break
    
  case 'summary':
    try {
      const summaryPath = path.join(process.cwd(), 'test-reports', 'enhanced-test-summary.json')
      const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'))
      
      log('📊 Last Enhanced Test Summary', 'bright')
      log(`Timestamp: ${summary.timestamp}`, 'blue')
      log(`Quality Score: ${summary.qualityScore}%`, summary.qualityScore >= 80 ? 'green' : 'yellow')
      log(`Passed: ${summary.passed}/${summary.totalTests}`, 'green')
      
    } catch (error) {
      log('No summary report found. Run tests first.', 'red')
    }
    break
    
  default:
    runEnhancedTests()
} 