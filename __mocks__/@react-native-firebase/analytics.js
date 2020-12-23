const analytics = () => ({
  setUserProperties: jest.fn().mockResolvedValue(true),
  setUserProperty: jest.fn().mockResolvedValue(true),
  setUserId: jest.fn().mockResolvedValue(true),
  logTutorialBegin: jest.fn().mockResolvedValue(true),
  logTutorialComplete: jest.fn().mockResolvedValue(true),
  logLogin: jest.fn().mockResolvedValue(true),
  logSignUp: jest.fn().mockResolvedValue(true),
  logEvent: jest.fn().mockResolvedValue(true),
  logAppOpen: jest.fn().mockResolvedValue(true),
  logSearch: jest.fn().mockResolvedValue(true),
  logSelectContent: jest.fn().mockResolvedValue(true),
  logShare: jest.fn().mockResolvedValue(true),
  logScreenView: jest.fn().mockResolvedValue(true),
})

export default analytics
