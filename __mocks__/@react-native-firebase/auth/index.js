const mockOptions = {
  createUserAndRetrieveDataWithEmailAndPassword: jest.fn().mockReturnValue(Promise.resolve(true)),
  sendPasswordResetEmail: jest.fn().mockReturnValue(Promise.resolve(true)),
  signInAndRetrieveDataWithEmailAndPassword: jest.fn().mockReturnValue(Promise.resolve(true)),
  fetchSignInMethodsForEmail: jest.fn().mockReturnValue(Promise.resolve(true)),
  signOut: jest.fn().mockReturnValue(Promise.resolve(true)),
  onAuthStateChanged: jest.fn(),
  currentUser: null,
}

const auth = jest.fn(() => mockOptions)

auth.setMockOptions = (options) => {
  Object.keys(options).forEach((key) => {
    mockOptions[key] = options[key]
  })
}

export default auth
