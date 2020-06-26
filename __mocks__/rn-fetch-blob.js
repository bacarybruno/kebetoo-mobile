const existsMock = jest.fn()
existsMock.mockReturnValueOnce({ then: jest.fn() })

export default {
  DocumentDir: () => { },
  ImageCache: {
    get: {
      clear: () => { },
    },
  },
  fs: {
    exists: existsMock,
    unlink: jest.fn().mockReturnValue(true),
    dirs: {
      MainBundleDir: 'jest://rnfs:MainBundleDir',
      CacheDir: 'jest://rnfs:CacheDir',
      DocumentDir: 'jest://rnfs:DocumentDir',
    },
  },
}
