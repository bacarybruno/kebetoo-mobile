module.exports = {
  root: true,
  extends: [
    'airbnb',
    'airbnb/hooks'
  ],
  rules: {
    'global-require': 0,
    'import/no-unresolved': [2, { ignore: ['Kebetoo/*'] }],
    'react/jsx-filename-extension': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-array-index-key': 0,
    'react/prop-types': 0,
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
