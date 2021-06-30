const existsMock = jest.fn();
existsMock.mockReturnValueOnce({ then: jest.fn() });

export default {
  DocumentDir: jest.fn(),
  ImageCache: {
    get: {
      clear: jest.fn(),
    },
  },
  fs: {
    cp: jest.fn().mockResolvedValue(),
    exists: existsMock,
    unlink: jest.fn().mockReturnValue(true),
    dirs: {
      MainBundleDir: 'jest://rnfs:MainBundleDir',
      CacheDir: 'jest://rnfs:CacheDir',
      DocumentDir: 'jest://rnfs:DocumentDir',
    },
  },
};
