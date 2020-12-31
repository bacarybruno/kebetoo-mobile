const messaging = () => ({
  hasPermission: jest.fn(() => Promise.resolve(true)),
  subscribeToTopic: jest.fn(),
  unsubscribeFromTopic: jest.fn(),
  requestPermission: jest.fn(() => Promise.resolve(true)),
  getToken: jest.fn().mockResolvedValue(Promise.resolve('RN-Firebase-Token')),
  onNotificationOpenedApp: jest.fn(),
  onTokenRefresh: jest.fn().mockReturnValue(() => {}),
  getInitialNotification: jest.fn().mockResolvedValue({}),
  onMessage: jest.fn().mockReturnValue(() => {}),
  isDeviceRegisteredForRemoteMessages: true,
})

export default messaging
