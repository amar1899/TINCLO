export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupReact.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/src/**/*.test.js',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/**/*.test.js',
  ],
  testTimeout: 10000,
};
