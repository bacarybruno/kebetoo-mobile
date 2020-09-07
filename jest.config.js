
module.exports = {
  preset: 'react-native',
  setupFiles: [
    './src/config/jest-setup.js',
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
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
    '^[./a-zA-Z0-9$_-]+\\icons/kebeticons$': '<rootDir>/__mocks__/@app/shared/icons/kebeticons',
    '^[./a-zA-Z0-9$_-]+\\http$': '<rootDir>/__mocks__/@app/shared/helpers/http',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__mocks__/',
    '/__fixtures__/',
    './src/shared/icons/',
  ],
}
