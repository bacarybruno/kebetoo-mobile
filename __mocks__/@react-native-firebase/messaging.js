const messaging = () => ({
  hasPermission: jest.fn(() => Promise.resolve(true)),
  subscribeToTopic: jest.fn(),
  unsubscribeFromTopic: jest.fn(),
  requestPermission: jest.fn(() => Promise.resolve(true)),
  getToken: jest.fn(() => Promise.resolve('RN-Firebase-Token')),
  onNotificationOpenedApp: jest.fn(),
  onTokenRefresh: jest.fn(),
  getInitialNotification: jest.fn().mockResolvedValue({}),
  onMessage: jest.fn(),
})

export default messaging
