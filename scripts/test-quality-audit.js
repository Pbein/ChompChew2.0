#!/usr/bin/env node

/**
 * Test Quality Audit Script
 * 
 * Automatically audits test files to identify:
 * - Tests that import real application code vs fake implementations
 * - Tests that define their own functions instead of importing them
 * - Potential test validity issues
 * 
 * Run: node scripts/test-quality-audit.js
 */

import fs from 'fs';
import path from 'path';

class TestQualityAuditor {
  constructor() {
    this.results = {
      totalTestFiles: 0,
      validTests: 0,
      suspiciousTests: 0,
      issues: [],
      recommendations: []
    };
  }

  /**
   * Main audit function
   */
  async auditTestSuite() {
    console.log('🔍 Starting Test Quality Audit...\n');
    
    const testFiles = this.findTestFiles('tests');
    this.results.totalTestFiles = testFiles.length;

    for (const testFile of testFiles) {
      await this.auditTestFile(testFile);
    }

    this.generateReport();
  }

  /**
   * Find all test files recursively
   */
  findTestFiles(dir) {
    const testFiles = [];
    
    const scanDirectory = (currentDir) => {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (item.endsWith('.test.ts') || item.endsWith('.test.tsx')) {
          testFiles.push(fullPath);
        }
      }
    };

    scanDirectory(dir);
    return testFiles;
  }

  /**
   * Audit individual test file
   */
  async auditTestFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const issues = this.analyzeTestFile(filePath, content);
      
      if (issues.length > 0) {
        this.results.suspiciousTests++;
        this.results.issues.push({
          file: filePath,
          issues: issues
        });
      } else {
        this.results.validTests++;
      }
    } catch (error) {
      console.error(`❌ Error reading ${filePath}:`, error.message);
    }
  }

  /**
   * Analyze test file content for quality issues
   */
  analyzeTestFile(filePath, content) {
    const issues = [];

    // Check for imports from src/ directories
    const srcImports = this.findSrcImports(content);
    const functionDefinitions = this.findFunctionDefinitions(content);
    const mockImplementations = this.findMockImplementations(content);

    // Issue 1: No imports from src/ but has function definitions
    if (srcImports.length === 0 && functionDefinitions.length > 0) {
      issues.push({
        type: 'NO_SRC_IMPORTS',
        severity: 'HIGH',
        message: 'Test defines functions but imports no real application code',
        details: `Found ${functionDefinitions.length} function definitions but no imports from src/`
      });
    }

    // Issue 2: Suspicious function definitions that might be fake implementations
    const suspiciousFunctions = functionDefinitions.filter(func => 
      func.includes('validate') || 
      func.includes('rateLimiter') || 
      func.includes('circuitBreaker') ||
      func.includes('retry') ||
      func.includes('authenticate') ||
      func.includes('authorize')
    );

    if (suspiciousFunctions.length > 0) {
      issues.push({
        type: 'SUSPICIOUS_IMPLEMENTATIONS',
        severity: 'HIGH',
        message: 'Test appears to implement core application logic',
        details: `Suspicious functions: ${suspiciousFunctions.join(', ')}`
      });
    }

    // Issue 3: High ratio of mocks to real imports
    if (mockImplementations.length > srcImports.length && srcImports.length > 0) {
      issues.push({
        type: 'HIGH_MOCK_RATIO',
        severity: 'MEDIUM',
        message: 'High ratio of mocks to real imports',
        details: `${mockImplementations.length} mocks vs ${srcImports.length} real imports`
      });
    }

    // Issue 4: Known problematic patterns
    const problematicPatterns = [
      { pattern: /const.*validate.*=.*\([^)]*\)\s*=>\s*{/g, message: 'Defines validation function instead of importing' },
      { pattern: /const.*rateLimiter.*=.*\([^)]*\)\s*=>\s*{/g, message: 'Defines rate limiter instead of importing' },
      { pattern: /function.*validate.*\([^)]*\)\s*{/g, message: 'Implements validation function' },
      { pattern: /class.*Mock.*Service/g, message: 'Creates mock service class' }
    ];

    for (const { pattern, message } of problematicPatterns) {
      if (pattern.test(content)) {
        issues.push({
          type: 'PROBLEMATIC_PATTERN',
          severity: 'MEDIUM',
          message: message,
          details: 'Consider importing real implementation instead'
        });
      }
    }

    return issues;
  }

  /**
   * Find imports from src/ directories
   */
  findSrcImports(content) {
    const importRegex = /import.*from\s+['"`](\.\.\/.*src\/.*|@\/.*|src\/.*)['"`]/g;
    const matches = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      matches.push(match[1]);
    }
    
    return matches;
  }

  /**
   * Find function definitions
   */
  findFunctionDefinitions(content) {
    const functionRegex = /(const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*{|function\s+\w+\s*\([^)]*\)\s*{)/g;
    const matches = [];
    let match;
    
    while ((match = functionRegex.exec(content)) !== null) {
      matches.push(match[0]);
    }
    
    return matches;
  }

  /**
   * Find mock implementations
   */
  findMockImplementations(content) {
    const mockRegex = /(jest\.fn\(\)|vi\.fn\(\)|mockImplementation|mockReturnValue)/g;
    const matches = [];
    let match;
    
    while ((match = mockRegex.exec(content)) !== null) {
      matches.push(match[0]);
    }
    
    return matches;
  }

  /**
   * Generate comprehensive audit report
   */
  generateReport() {
    console.log('📊 TEST QUALITY AUDIT REPORT');
    console.log('='.repeat(50));
    console.log(`📁 Total Test Files: ${this.results.totalTestFiles}`);
    console.log(`✅ Valid Tests: ${this.results.validTests}`);
    console.log(`⚠️  Suspicious Tests: ${this.results.suspiciousTests}`);
    console.log(`📈 Quality Score: ${Math.round((this.results.validTests / this.results.totalTestFiles) * 100)}%\n`);

    if (this.results.issues.length > 0) {
      console.log('🚨 ISSUES FOUND:');
      console.log('-'.repeat(30));
      
      this.results.issues.forEach((fileIssue, index) => {
        console.log(`\n${index + 1}. ${fileIssue.file}`);
        
        fileIssue.issues.forEach(issue => {
          const severity = issue.severity === 'HIGH' ? '🔴' : '🟡';
          console.log(`   ${severity} ${issue.type}: ${issue.message}`);
          console.log(`      ${issue.details}`);
        });
      });
    }

    this.generateRecommendations();
    this.saveReportToFile();
  }

  /**
   * Generate specific recommendations based on findings
   */
  generateRecommendations() {
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('-'.repeat(20));

    const highSeverityIssues = this.results.issues.filter(fileIssue => 
      fileIssue.issues.some(issue => issue.severity === 'HIGH')
    );

    if (highSeverityIssues.length > 0) {
      console.log('🔴 HIGH PRIORITY:');
      console.log('   1. Review files with no src/ imports but function definitions');
      console.log('   2. Replace fake implementations with real code imports');
      console.log('   3. Focus on validation, authentication, and rate limiting tests');
    }

    const mediumSeverityIssues = this.results.issues.filter(fileIssue => 
      fileIssue.issues.some(issue => issue.severity === 'MEDIUM')
    );

    if (mediumSeverityIssues.length > 0) {
      console.log('\n🟡 MEDIUM PRIORITY:');
      console.log('   1. Reduce mock usage in favor of real implementations');
      console.log('   2. Review problematic patterns identified');
      console.log('   3. Ensure integration tests use real services');
    }

    console.log('\n📋 GENERAL RECOMMENDATIONS:');
    console.log('   • All tests should import from src/ directories when testing core logic');
    console.log('   • Mock only external dependencies, not core application code');
    console.log('   • Validate error messages match real application responses');
    console.log('   • Use integration tests to verify real component interactions');
  }

  /**
   * Save detailed report to JSON file
   */
  saveReportToFile() {
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTestFiles: this.results.totalTestFiles,
        validTests: this.results.validTests,
        suspiciousTests: this.results.suspiciousTests,
        qualityScore: Math.round((this.results.validTests / this.results.totalTestFiles) * 100)
      },
      issues: this.results.issues
    };

    const reportPath = 'test-quality-audit-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`\n💾 Detailed report saved to: ${reportPath}`);
  }
}

// Run the audit
const auditor = new TestQualityAuditor();

auditor.auditTestSuite().catch(console.error);

export default TestQualityAuditor; 