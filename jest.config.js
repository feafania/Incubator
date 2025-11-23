/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testTimeout: 100000, // Increase timeout for tests
  testRegex: "__tests__/.*.e2e.test.ts$",
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};