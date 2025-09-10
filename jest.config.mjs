export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: { jsx: 'react-jsx' },
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(jpg|jpeg|png|gif|webp|svg|pdf)$': '<rootDir>/__mocks__/fileMock.cjs',
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/src/**/*.d.ts',
    '!<rootDir>/src/**/?(*.)+(spec|test).{ts,tsx}',
    '!<rootDir>/src/app/main.tsx',
    '!<rootDir>/src/mocks/**',
    '!<rootDir>/src/i18n/**',
    '!<rootDir>/src/assets/**',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['text', 'text-summary', 'lcovonly'],
};
