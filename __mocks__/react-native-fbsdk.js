module.exports = {
  LoginManager: {
    logInWithPermissions: jest.fn(),
    logOut: jest.fn(),
  },
  AccessToken: {
    getCurrentAccessToken: jest.fn().mockReturnValue(Promise.resolve('mock-access-token')),
  },
};
