module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.app.json',
    }],
  },
  setupFilesAfterEnv: ['./setupTests.ts'],
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx)'],
};
