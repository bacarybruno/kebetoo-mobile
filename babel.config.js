const configs = {
  moduleResolver: {
    root: ['./src'],
    extensions: [
      '.ios.ts',
      '.android.ts',
      '.ts',
      '.ios.tsx',
      '.android.tsx',
      '.tsx',
      '.jsx',
      '.js',
      '.json',
    ],
    alias: {
      '@app': './src',
      '@assets': './assets',
      '@fixtures': './__fixtures__',
    },
  },
  dotEnv: {
    safe: true,
    allowUndefined: false,
  },
  jsxTransform: {
    runtime: 'automatic',
  },
};

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module:react-native-dotenv', configs.dotEnv],
    ['module-resolver', configs.moduleResolver],
    ['@babel/plugin-transform-react-jsx', configs.jsxTransform],
  ],
};
