const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  moduleNameMapper: {
    "^next/link$": "<rootDir>/src/test-utils/nextLinkMock.tsx",
    "^next/navigation$": "<rootDir>/src/test-utils/nextNavigationMock.ts",
  },
};

module.exports = createJestConfig(customJestConfig);
