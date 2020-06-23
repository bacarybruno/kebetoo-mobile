const mockUserInfo = {
  idToken: 'mockIdToken',
  accessToken: null,
  serverAuthCode: 'mockServerAuthCode',
  scopes: [], // on iOS this is empty array if no additional scopes are defined
  user: {
    email: 'mockEmail',
    id: 'mockId',
    givenName: 'mockGivenName',
    familyName: 'mockFamilyName',
    photo: 'mockPhotoUrl',
    name: 'mockFullName',
  },
}

const GoogleSignin = {
  configure: jest.fn(),
  hasPlayServices: jest.fn(() => Promise.resolve(true)),
  signIn: jest.fn(() => Promise.resolve(mockUserInfo)),
  signInSilently: jest.fn(() => Promise.resolve(mockUserInfo)),
  revokeAccess: jest.fn(() => Promise.resolve(true)),
  signOut: jest.fn(() => Promise.resolve(true)),
}

const GoogleSigninMock = {
  GoogleSignin,
}

GoogleSigninMock.setGoogleSigninMockOptions = (options) => {
  Object.keys(options).forEach((key) => {
    GoogleSigninMock[key] = options[key]
  })
}

module.exports = GoogleSigninMock
