export default {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  setupFiles: ['<rootDir>/tests/setupEnv.js'],
  clearMocks: true,
  collectCoverageFrom: [
    'src/middlewares/authMiddleware.js',
    'src/middlewares/roleMiddleware.js',
    'src/validators/validationMiddleware.js',
    'src/utils/httpErrors.js',
    'src/controllers/authController.js',
    'src/controllers/departamentoController.js'
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
