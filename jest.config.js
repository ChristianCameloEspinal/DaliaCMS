const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/core/(.*)$': '<rootDir>/app/(backend)/core/$1',
    '^@/db/(.*)$': '<rootDir>/app/(backend)/db/$1',
    '^@/editor/(.*)$': '<rootDir>/app/(backend)/editor/$1',
    '^@/media/(.*)$': '<rootDir>/app/(backend)/media/$1',
    '^@/components/(.*)$': '<rootDir>/app/(backend)/components/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
};

module.exports = createJestConfig(customJestConfig);
