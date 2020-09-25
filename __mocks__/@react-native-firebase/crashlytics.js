const crashlytics = () => ({
  setUserProperties: jest.fn(),
  setUserId: jest.fn(),
  recordError: jest.fn(),
})

export default crashlytics
