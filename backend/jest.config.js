export default {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  setupFiles: ['<rootDir>/tests/setupEnv.js'],
  clearMocks: true,
  collectCoverageFrom: [
    'src/controllers/**/*.js',
    'src/middlewares/authMiddleware.js',
    'src/middlewares/roleMiddleware.js',
    'src/middlewares/dataIntegrityMiddleware.js',
    'src/middlewares/uploadMiddleware.js',
    'src/validators/validationMiddleware.js',
    'src/utils/**/*.js'
  ],
  coverageDirectory: 'reports/jest/coverage',
  coverageReporters: ['text', 'html', 'lcov', 'json-summary'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 85,
      lines: 80
    }
  }
};
