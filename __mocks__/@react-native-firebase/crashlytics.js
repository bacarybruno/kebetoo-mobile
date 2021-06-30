const crashlytics = () => ({
  setAttributes: jest.fn().mockResolvedValue(true),
  setAttribute: jest.fn().mockResolvedValue(true),
  setUserId: jest.fn().mockResolvedValue(true),
  recordError: jest.fn().mockResolvedValue(true),
});

export default crashlytics;
