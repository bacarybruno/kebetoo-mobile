module.exports = {
  root: true,
  extends: [
    'airbnb',
    'airbnb/hooks'
  ],
  rules: {
    'react/jsx-filename-extension': 0,
    'react/jsx-one-expression-per-line': 0,
    'semi': 0,
  },
  settings: {
    'import/resolver': {
      'node': {
        'extensions': ['.js', '.jsx', '.json', '.native.js']
      }
    }
  }
};
