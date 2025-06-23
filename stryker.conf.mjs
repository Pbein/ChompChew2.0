/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
export default {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress', 'dashboard'],
  testRunner: 'vitest',
  testRunnerNodeArgs: ['--experimental-loader', '@stryker-mutator/vitest-runner/loader'],
  coverageAnalysis: 'perTest',
  mutate: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/*.test.ts',
    '!src/**/*.test.tsx',
    '!src/**/*.d.ts',
    '!src/**/types/**',
    '!src/**/*.stories.tsx'
  ],
  ignore: [
    '**/node_modules/**',
    '**/tests/**',
    '**/dist/**',
    '**/coverage/**',
    '**/*.config.*',
    '**/test-*/**'
  ],
  thresholds: {
    high: 80,
    low: 65,
    break: 50
  },
  checkers: ['typescript'],
  tsconfigFile: 'tsconfig.json',
  dashboard: {
    project: 'github.com/your-org/chompchew',
    version: 'main'
  },
  htmlReporter: {
    fileName: 'reports/mutation-report.html'
  },
  timeoutMS: 30000,
  maxConcurrentTestRunners: 4,
  disableTypeChecks: '{test,spec}/**/*.{js,ts,jsx,tsx}',
  tempDirName: 'stryker-tmp'
} 