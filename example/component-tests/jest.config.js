/** @type {import('jest').Config} */
const config = {
  maxWorkers: 1,
  globalSetup: "detox/runners/jest/globalSetup",
  globalTeardown: "detox/runners/jest/globalTeardown",
  testEnvironment: "detox/runners/jest/testEnvironment",
  setupFilesAfterEnv: ["./setup.ts"],
  testRunner: "jest-circus/runner",
  testTimeout: 120000,
  roots: ["<rootDir>/../src"],
  testMatch: ["**/*.component.test.ts"],
  transform: {
    "\\.tsx?$": ["ts-jest", { tsconfig: "<rootDir>/../tsconfig.json" }],
  },
  reporters: ["detox/runners/jest/reporter"],
  verbose: true,
};

// TEST_PATH env var narrows to specific test files (set by test.sh)
if (process.env.TEST_PATH) {
  config.testRegex = process.env.TEST_PATH;
  delete config.testMatch;
}

module.exports = config;
