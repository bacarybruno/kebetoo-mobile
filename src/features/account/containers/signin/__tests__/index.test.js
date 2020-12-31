import { render, fireEvent, act } from 'react-native-testing-library'
import auth from '@react-native-firebase/auth'

import setupTest from '@app/config/jest-setup'
import { strings } from '@app/config'
import routes from '@app/navigation/routes'

import SignIn from '../index'
import { fieldNames } from '../hook'

beforeEach(jest.clearAllMocks)

const userInfos = {
  email: 'bacarybruno@kebetoo.com',
  password: 'Kebetoo!',
}

const givenSignIn = setupTest(SignIn, render)({
  navigation: {
    setOptions: jest.fn(),
    navigate: jest.fn(),
    addListener: jest.fn().mockReturnValue(jest.fn()),
  },
})

const givenSignInTestRenderer = setupTest(SignIn)({
  navigation: {
    setOptions: jest.fn(),
    navigate: jest.fn(),
    addListener: jest.fn().mockReturnValue(jest.fn()),
  },
})

it('renders Signin', () => {
  const { wrapper } = givenSignIn()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

test('screen title', () => {
  const { props } = givenSignIn()
  expect(props.navigation.setOptions).toBeCalledWith({ title: strings.auth.signin })
})

it('navigates to signup', () => {
  const { wrapper, props } = givenSignIn()
  fireEvent.press(wrapper.getByText(strings.auth.signup))
  expect(props.navigation.navigate).toBeCalledTimes(1)
  expect(props.navigation.navigate).toBeCalledWith(routes.SIGNUP)
})

describe('submit', () => {
  const getElements = (wrapper) => ({
    emailInput: wrapper.getByPlaceholder(strings.auth.email),
    passwordInput: wrapper.getByPlaceholder(strings.auth.password),
    signInButton: wrapper.getByText(strings.auth.signin.toUpperCase()),
  })

  it('throws error if infos are not valid', async () => {
    const { wrapper } = givenSignIn()
    const { signInWithEmailAndPassword } = auth()
    const { emailInput, passwordInput, signInButton } = getElements(wrapper)
    fireEvent.changeText(emailInput, 'fake-mail')
    fireEvent(emailInput, 'onSubmitEditing')
    fireEvent.changeText(passwordInput, '123')
    await fireEvent.press(signInButton)
    expect(signInWithEmailAndPassword).toBeCalledTimes(0)
  })

  it('connects the user if infos are valid', async () => {
    const { wrapper } = givenSignIn()
    const { signInWithEmailAndPassword } = auth()
    const { emailInput, passwordInput, signInButton } = getElements(wrapper)
    fireEvent.changeText(emailInput, userInfos.email)
    fireEvent(emailInput, 'onSubmitEditing')
    fireEvent.changeText(passwordInput, userInfos.password)
    await fireEvent.press(signInButton)
    expect(signInWithEmailAndPassword).toBeCalledTimes(1)
    expect(signInWithEmailAndPassword).toBeCalledWith(userInfos.email, userInfos.password)
  })
})

describe('form fields validation', () => {
  it('is invalid', () => {
    const { wrapper } = givenSignInTestRenderer()
    const emailInput = wrapper.root.findByProps({ fieldName: fieldNames.email })
    act(() => {
      emailInput.props.onValueChange('invalidemail', fieldNames.email)
    })
    act(() => {
      emailInput.props.onBlur(fieldNames.email)
    })
    expect(emailInput.props.error).toBeTruthy()
  })
  it('is valid', () => {
    const { wrapper } = givenSignInTestRenderer()
    const emailInput = wrapper.root.findByProps({ fieldName: fieldNames.email })
    act(() => {
      emailInput.props.onValueChange('bacarybruno@gmail.com', fieldNames.email)
    })
    act(() => {
      emailInput.props.onBlur(fieldNames.email)
    })
    expect(emailInput.props.error).toBeFalsy()
  })
})

describe('auth errors', () => {
  const testCases = {
    'auth/user-not-found': {
      fieldName: fieldNames.email,
      fieldValue: strings.errors.auth_user_not_found,
    },
    'auth/wrong-password': {
      fieldName: fieldNames.password,
      fieldValue: strings.errors.auth_wrong_password,
    },
    'auth/user-disabled': {
      fieldName: fieldNames.email,
      fieldValue: strings.errors.auth_user_disabled,
    },
    'auth/account-exists-with-different-credential': {
      fieldName: fieldNames.email,
      fieldValue: strings.errors.auth_account_exists_different_credential,
    },
  }

  Object.keys(testCases).forEach((errorCode) => {
    it(`handles ${errorCode} error`, async () => {
      auth().signInWithEmailAndPassword = jest.fn().mockRejectedValue({ code: errorCode })
      const { wrapper } = givenSignInTestRenderer()

      const emailInput = wrapper.root.findByProps({ placeholder: strings.auth.email })
      const passwordInput = wrapper.root.findByProps({ placeholder: strings.auth.password })
      const signInButton = wrapper.root.findByProps({ text: strings.auth.signin.toUpperCase() })

      emailInput.props.onValueChange('bacarybruno@gmail.com', fieldNames.email)
      fireEvent(emailInput, 'onSubmitEditing')
      passwordInput.props.onValueChange('12345678', fieldNames.password)

      await act(async () => {
        await fireEvent.press(signInButton)
      })

      expect(wrapper.root.findByProps({ fieldName: testCases[errorCode].fieldName }).props.error)
        .toBe(testCases[errorCode].fieldValue)
    })
  })
})
