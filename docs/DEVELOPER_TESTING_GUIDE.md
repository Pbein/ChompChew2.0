# 🧪 Developer Testing Guide

## Quick Start for ChompChew Developers

This guide helps you use our comprehensive test suite effectively in your daily development workflow.

---

## 🚀 **Quick Commands**

### **Daily Development**
```bash
# Check if tests are healthy (run this first each day)
npm run test:health

# Run tests while developing (watch mode)
npm run test:watch

# Quick unit test feedback
npm run test:unit
```

### **Before Committing**
```bash
# Run critical tests (most important)
npm run test:critical

# Run security tests (for safety-critical features)
npm run test:security

# Generate test report
npm run test:report
```

### **Before Deployment**
```bash
# Run comprehensive test suite
npm run test:comprehensive

# Run integration tests
npm run test:integration

# Generate coverage report
npm run test:coverage
```

---

## 📋 **Available Test Commands**

| Command | Purpose | When to Use | Duration |
|---------|---------|-------------|----------|
| `npm run test:health` | Check test suite status | Start of day, debugging | ~5 seconds |
| `npm run test:critical` | Run most important tests | Before commits, CI/CD | ~30 seconds |
| `npm run test:unit` | Run unit tests only | During development | ~15 seconds |
| `npm run test:security` | Run security tests | Security-related changes | ~10 seconds |
| `npm run test:performance` | Run performance tests | Performance optimization | ~20 seconds |
| `npm run test:integration` | Run integration tests | Feature completion | ~45 seconds |
| `npm run test:infrastructure` | Run infrastructure tests | Backend changes | ~25 seconds |
| `npm run test:comprehensive` | Run all tests | Pre-deployment | ~2-3 minutes |
| `npm run test:coverage` | Generate coverage report | Coverage analysis | ~1 minute |
| `npm run test:clean` | Clean test artifacts | Cleanup, debugging | ~2 seconds |
| `npm run test:report` | Generate test report | Documentation | ~3 seconds |

---

## 🔄 **Development Workflows**

### **Feature Development Workflow**
```bash
# 1. Start development
npm run test:health          # Ensure tests are working
npm run test:watch           # Start watch mode

# 2. During development
# (tests run automatically in watch mode)

# 3. Before committing
npm run test:critical        # Run critical tests
npm run test:security        # Run security tests (if applicable)

# 4. Before pushing
npm run test:integration     # Run integration tests
```

### **Bug Fix Workflow**
```bash
# 1. Reproduce the issue
npm run test:health          # Check test environment

# 2. Write failing test (if needed)
npm run test:unit            # Run unit tests

# 3. Fix the bug
npm run test:watch           # Watch tests while fixing

# 4. Verify fix
npm run test:critical        # Ensure critical functionality works
```

### **Security Feature Workflow**
```bash
# 1. Before starting
npm run test:security        # Check current security test status

# 2. During development
npm run test:watch           # Watch mode for immediate feedback

# 3. After implementation
npm run test:security        # Run full security test suite
npm run test:critical        # Ensure nothing broke
```

### **Performance Optimization Workflow**
```bash
# 1. Baseline measurement
npm run test:performance     # Get current performance metrics

# 2. Make optimizations
npm run test:watch           # Watch for regressions

# 3. Verify improvements
npm run test:performance     # Compare performance metrics
npm run test:comprehensive   # Ensure no functionality broken
```

---

## 🎯 **Test Categories Explained**

### **Critical Tests** (`npm run test:critical`)
**What**: 79 tests covering authentication, AI services, rate limiting, security validation, and database operations.
**When**: Before every commit, in CI/CD pipeline.
**Why**: These tests ensure core functionality works correctly.

### **Unit Tests** (`npm run test:unit`)
**What**: 200+ tests covering individual components, services, and utilities.
**When**: During active development, in watch mode.
**Why**: Fast feedback for individual function/component changes.

### **Security Tests** (`npm run test:security`)
**What**: 50+ tests covering XSS prevention, SQL injection protection, input validation.
**When**: When working on user input, authentication, or data handling.
**Why**: ChompChew handles dietary restrictions - user safety is critical.

### **Integration Tests** (`npm run test:integration`)
**What**: 150+ tests covering database operations, API integration, full-stack flows.
**When**: Before deployment, after major feature completion.
**Why**: Ensures different parts of the system work together correctly.

### **Performance Tests** (`npm run test:performance`)
**What**: 15+ tests covering Core Web Vitals, memory usage, JavaScript performance.
**When**: During performance optimization, before major releases.
**Why**: Ensures optimal user experience and system efficiency.

### **Infrastructure Tests** (`npm run test:infrastructure`)
**What**: 80+ tests covering Redis, rate limiting, middleware, external services.
**When**: When modifying backend infrastructure or external integrations.
**Why**: Ensures system reliability and proper error handling.

---

## 🚨 **Troubleshooting**

### **Tests Not Running**
```bash
# Check test environment health
npm run test:health

# Clean test artifacts
npm run test:clean

# Reinstall dependencies
npm ci
```

### **Slow Test Performance**
```bash
# Run only unit tests for faster feedback
npm run test:unit

# Clean test artifacts
npm run test:clean

# Check for hanging processes
npm run test:benchmark
```

### **Test Failures**
```bash
# Check which category is failing
npm run test:health

# Run specific test category
npm run test:critical        # Most important tests
npm run test:security        # Security-related tests
npm run test:unit           # Individual component tests
```

### **CI/CD Issues**
```bash
# Run the same tests as CI/CD
npm run test:critical
npm run test:security
npm run test:integration

# Generate comprehensive report
npm run test:report
```

---

## 📊 **Understanding Test Results**

### **Test Status Indicators**
- ✅ **Passing**: Test executed successfully
- ❌ **Failing**: Test found an issue that needs attention
- ⏭️ **Skipped**: Test was skipped (usually intentionally)
- ⏱️ **Timeout**: Test took too long (may indicate performance issue)

### **Pass Rate Guidelines**
- **Critical Tests**: Aim for 90%+ pass rate
- **Unit Tests**: Aim for 95%+ pass rate
- **Security Tests**: Aim for 100% pass rate (security is non-negotiable)
- **Integration Tests**: 85%+ pass rate is acceptable (more complex scenarios)

### **When to Be Concerned**
- 🚨 **Critical tests failing**: Stop and fix immediately
- 🚨 **Security tests failing**: Do not deploy until fixed
- ⚠️ **Performance tests degrading**: Investigate performance impact
- ⚠️ **Multiple test categories failing**: Check for systemic issues

---

## 🎉 **Best Practices**

### **Do's**
✅ Run `npm run test:health` at the start of each day  
✅ Use `npm run test:watch` during active development  
✅ Run `npm run test:critical` before every commit  
✅ Run `npm run test:security` when handling user data  
✅ Run `npm run test:comprehensive` before deployment  
✅ Fix failing tests immediately, don't let them accumulate  

### **Don'ts**
❌ Don't commit code with failing critical tests  
❌ Don't ignore security test failures  
❌ Don't skip tests when working on dietary restriction features  
❌ Don't deploy without running integration tests  
❌ Don't let test performance degrade without investigation  

---

## 🔗 **Integration with Development Tools**

### **VS Code Integration**
Add these tasks to your `.vscode/tasks.json`:
```json
{
  "label": "Test: Health Check",
  "type": "shell",
  "command": "npm run test:health",
  "group": "test"
},
{
  "label": "Test: Critical",
  "type": "shell", 
  "command": "npm run test:critical",
  "group": "test"
}
```

### **Git Hooks**
Add to your pre-commit hook:
```bash
#!/bin/sh
npm run test:critical
```

### **IDE Test Runner**
Most IDEs can run individual test files. Use this for focused debugging:
- Run single test file: `npm test tests/specific-file.test.ts`
- Run specific test pattern: `npm test -- --grep "specific test name"`

---

## 📚 **Additional Resources**

- **Full Test Suite Documentation**: `docs/COMPREHENSIVE_TEST_SUITE.md`
- **Test Maintenance Script**: `scripts/test-maintenance.js`
- **CI/CD Configuration**: `.github/workflows/comprehensive-testing.yml`
- **Test Configuration**: `tests/setup/vitest.config.ts`

---

## 🆘 **Getting Help**

### **Common Issues**
1. **Tests failing after pulling latest code**: Run `npm run test:health` and `npm ci`
2. **Slow test performance**: Use `npm run test:unit` for faster feedback
3. **CI/CD failures**: Check the same test categories locally first
4. **Test environment issues**: Run `npm run test:clean` and restart

### **Team Support**
- Check the test health status first: `npm run test:health`
- Share test reports when asking for help: `npm run test:report`
- Include specific test category when reporting issues
- Use the test maintenance script for debugging: `node scripts/test-maintenance.js help`

---

**Happy Testing!** 🧪✨

*Remember: Our comprehensive test suite ensures ChompChew users stay safe with their dietary restrictions. Every test matters!* 