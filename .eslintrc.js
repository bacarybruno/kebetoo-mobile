module.exports = {
  root: true,
  parser: 'babel-eslint',
  plugins: ['jest'],
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:jest/recommended',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  rules: {
    'global-require': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-uses-react': 0,
    'react/no-array-index-key': 0,
    'react/react-in-jsx-scope': 0,
    'react/prop-types': 0,
    'semi': 0,
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
