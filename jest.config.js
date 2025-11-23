/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testTimeout: 100000, // Increase timeout for tests
  testRegex: "__tests__/.*.e2e.test.ts$",
  testEnvironment: "node",
  detectOpenHandles: true, // Уключыць праверку адкрытых рэсурсаў
  forceExit: true, // Прымусова завяршаць Jest пасля выканання тэстаў
  verbose: true, // Больш дэталёвая інфармацыя
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};