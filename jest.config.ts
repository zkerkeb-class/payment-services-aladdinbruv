const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/server.ts', '!src/config/**'],
  coverageThreshold: { global: { lines: 50, statements: 50 } },
  clearMocks: true,
};

export default config;
