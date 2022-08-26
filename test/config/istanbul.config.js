// eslint-disable-next-line
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,vue}',
    '!<rootDir>/node_modules/',
  ],
  coverageDirectory: '<rootDir>/test/coverage',
  coverageReporters: ['clover', 'json', 'lcov', ['text', { skipFull: true }]],
}
