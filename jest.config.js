
module.exports = {
  preset: 'react-native',
  setupFiles: [
    './src/config/jest-setup.js',
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native-community)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  moduleNameMapper: {
    // react-navigation v5
    // node_modules\@react-navigation\stack\lib\commonjs\views\assets\back-icon.png
    'views/assets/[a-z](.+).png$': '<rootDir>/__mocks__/file-mock',
  },
}
