const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/server.ts', '!src/config/**'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json-summary'],
  coverageThreshold: { 
    global: { 
      lines: 70, 
      statements: 70, 
      branches: 70, 
      functions: 70 
    } 
  },
  clearMocks: true,
};

export default config;
