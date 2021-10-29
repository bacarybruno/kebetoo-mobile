export default {
  DocumentDir: jest.fn(),
  ImageCache: {
    get: {
      clear: jest.fn(),
    },
  },
  fs: {
    cp: jest.fn().mockResolvedValue({}),
    exists: jest.fn().mockResolvedValue({}),
    unlink: jest.fn().mockResolvedValue({}),
    mkdir: jest.fn().mockResolvedValue({}),
    dirs: {
      MainBundleDir: 'jest://rnfs:MainBundleDir',
      CacheDir: 'jest://rnfs:CacheDir',
      DocumentDir: 'jest://rnfs:DocumentDir',
    },
  },
};
