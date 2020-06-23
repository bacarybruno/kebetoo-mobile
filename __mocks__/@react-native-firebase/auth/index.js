const user = {
  email: 'mockEmail',
  uid: 'mockUid',
  displayName: 'mockDisplayName',
  photoURL: 'https://avatars1.githubusercontent.com/u/14147533',
  updateProfile: jest.fn(),
}

export const authCredentials = {
  user,
  additionalUserInfo: {
    profile: { id: 'mock-user-profile-id' },
  },
}

const mockOptions = {
  createUserAndRetrieveDataWithEmailAndPassword: jest.fn().mockReturnValue(Promise.resolve(true)),
  sendPasswordResetEmail: jest.fn().mockReturnValue(Promise.resolve(true)),
  signInAndRetrieveDataWithEmailAndPassword: jest.fn().mockReturnValue(Promise.resolve(true)),
  fetchSignInMethodsForEmail: jest.fn().mockReturnValue(Promise.resolve(true)),
  signOut: jest.fn().mockReturnValue(Promise.resolve(true)),
  onAuthStateChanged: jest.fn(),
  signInWithCredential: jest.fn().mockReturnValue(authCredentials),
  credentials: authCredentials,
  currentUser: user,
}

const auth = jest.fn(() => mockOptions)

const socialAuthProviderData = {
  credential: jest.fn().mockReturnValue({
    providerId: 'jest',
    secret: 'mock-google-credentials-secret',
    token: 'mock-google-credentials-token',
  }),
}

auth.GoogleAuthProvider = socialAuthProviderData

auth.FacebookAuthProvider = socialAuthProviderData

auth.setMockOptions = (options) => {
  Object.keys(options).forEach((key) => {
    mockOptions[key] = options[key]
  })
}

export default auth
