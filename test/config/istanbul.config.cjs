// eslint-disable-next-line
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,vue}',
    '!<rootDir>/node_modules/',
    '!<rootDir>/src/components/**/*.stories.ts',
    '!<rootDir>/src/components/**/*/index.ts',
  ],
  coverageDirectory: '<rootDir>/test/coverage',
  coverageReporters: ['clover', 'json', 'lcov', ['text', { skipFull: true }]],
};
