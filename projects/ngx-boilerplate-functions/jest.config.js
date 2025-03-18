module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/../../jest.setup.ts'],
  transform: {
    "^.+\\.(ts|js|html)$": "jest-preset-angular"
  },
  moduleDirectories: ['node_modules', '<rootDir>']
};
