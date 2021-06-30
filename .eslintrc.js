module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  plugins: ['jest'],
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:jest/recommended',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  rules: {
    'global-require': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-uses-react': 'off',
    'react/no-array-index-key': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'semi': 'off',
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'no-console': 'off',
    'no-unused-expressions': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    'import/no-cycle': 'warn'
  },
  settings: {
    'import/resolver': {
      'node': {
        'extensions': ['.js', '.jsx', '.json', '.native.js']
      },
      'babel-module': {}
    }
  }
};
