const analytics = () => ({
  setUserProperties: jest.fn(),
  setUserId: jest.fn(),
  logTutorialBegin: jest.fn(),
  logTutorialComplete: jest.fn(),
  logLogin: jest.fn(),
  logSignUp: jest.fn(),
  logEvent: jest.fn(),
  logAppOpen: jest.fn(),
  logSearch: jest.fn(),
  logSelectContent: jest.fn(),
  logShare: jest.fn(),
  logScreenView: jest.fn(),
})

export default analytics
