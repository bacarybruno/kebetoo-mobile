import { render, fireEvent } from 'react-native-testing-library'
import auth from '@react-native-firebase/auth'
import { act } from 'react-test-renderer'
import { Linking } from 'react-native'

import setupTest from '@app/config/jest-setup'
import { strings } from '@app/config'
import routes from '@app/navigation/routes'

import SignUp, { fieldNames } from '../index'

afterEach(jest.clearAllMocks)

const userInfos = {
  fullName: 'Bruno Bodian',
  email: 'bacarybruno@kebetoo.com',
  password: 'Kebetoo!',
}

const givenSignUp = setupTest(SignUp, render)({
  navigation: {
    setOptions: jest.fn(),
    navigate: jest.fn(),
    addListener: jest.fn().mockImplementation((e, callback) => { callback(); return jest.fn() }),
  },
})

const givenSignUpTestRenderer = setupTest(SignUp)({
  navigation: {
    setOptions: jest.fn(),
    navigate: jest.fn(),
    addListener: jest.fn().mockImplementation((e, callback) => { callback(); return jest.fn() }),
  },
})

it('renders SignUp', () => {
  const { wrapper } = givenSignUp()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

test('screen title', () => {
  const { props } = givenSignUp()
  expect(props.navigation.setOptions).toBeCalledWith({ title: strings.auth.signup })
})

it('navigates to signin', () => {
  const { wrapper, props } = givenSignUp()
  fireEvent.press(wrapper.getByText(strings.auth.signin))
  expect(props.navigation.navigate).toBeCalledTimes(1)
  expect(props.navigation.navigate).toBeCalledWith(routes.SIGNIN)
})

describe('submit', () => {
  const getElements = (wrapper) => ({
    emailInput: wrapper.getByPlaceholder(strings.auth.email),
    passwordInput: wrapper.getByPlaceholder(strings.auth.password),
    fullNameInput: wrapper.getByPlaceholder(strings.auth.fullname),
    SignUpButton: wrapper.getByText(strings.auth.signup.toUpperCase()),
  })
  it('throws error if infos are not valid', async () => {
    const { wrapper } = givenSignUp()
    const { createUserWithEmailAndPassword } = auth()
    const {
      emailInput, passwordInput, SignUpButton, fullNameInput,
    } = getElements(wrapper)
    fireEvent.changeText(fullNameInput, '')
    fireEvent.changeText(emailInput, userInfos.email)
    fireEvent(emailInput, 'onSubmitEditing')
    fireEvent.changeText(passwordInput, '')
    await fireEvent.press(SignUpButton)
    expect(createUserWithEmailAndPassword).toBeCalledTimes(0)
  })
  it('connects the user if infos are valid', async () => {
    const { wrapper } = givenSignUp()
    const { createUserWithEmailAndPassword } = auth()
    const {
      emailInput, passwordInput, SignUpButton, fullNameInput,
    } = getElements(wrapper)
    fireEvent.changeText(fullNameInput, userInfos.fullName)
    fireEvent.changeText(emailInput, userInfos.email)
    fireEvent(emailInput, 'onSubmitEditing')
    fireEvent.changeText(passwordInput, userInfos.password)
    await fireEvent.press(SignUpButton)
    expect(createUserWithEmailAndPassword).toBeCalledTimes(1)
    expect(createUserWithEmailAndPassword).toBeCalledWith(userInfos.email, userInfos.password)
  })
})


describe('form fields validation', () => {
  it('is invalid', () => {
    const { wrapper } = givenSignUpTestRenderer()
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
    const { wrapper } = givenSignUpTestRenderer()
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
    'auth/email-already-in-use': {
      fieldName: fieldNames.email,
      fieldValue: strings.errors.auth_email_already_in_use,
    },
    'auth/account-exists-with-different-credential': {
      fieldName: fieldNames.email,
      fieldValue: strings.errors.auth_account_exists_different_credential,
    },
  }

  Object.keys(testCases).forEach((errorCode) => {
    it(`handles ${errorCode} error`, async () => {
      auth().createUserWithEmailAndPassword = jest.fn().mockRejectedValue({ code: errorCode })
      const { wrapper } = givenSignUpTestRenderer()

      const fullnameInput = wrapper.root.findByProps({ placeholder: strings.auth.fullname })
      const emailInput = wrapper.root.findByProps({ placeholder: strings.auth.email })
      const passwordInput = wrapper.root.findByProps({ placeholder: strings.auth.password })
      const signUpButton = wrapper.root.findByProps({ text: strings.auth.signup.toUpperCase() })

      fullnameInput.props.onValueChange('Testeur', fieldNames.fullName)
      fireEvent(emailInput, 'onSubmitEditing')
      emailInput.props.onValueChange('bacarybruno@gmail.com', fieldNames.email)
      fireEvent(emailInput, 'onSubmitEditing')
      passwordInput.props.onValueChange('12345678', fieldNames.password)

      await act(async () => {
        await fireEvent.press(signUpButton)
      })

      expect(wrapper.root.findByProps({ fieldName: testCases[errorCode].fieldName }).props.error)
        .toBe(testCases[errorCode].fieldValue)
    })
  })
})


describe('terms and privacy', () => {
  it('opens terms and conditions on click', () => {
    const { wrapper } = givenSignUpTestRenderer()
    fireEvent.press(wrapper.root.findByProps({ text: strings.auth.terms_and_conditions }))
    expect(Linking.openURL).toBeCalledTimes(1)
    expect(Linking.openURL).toBeCalledWith(strings.auth.tos_url)
  })
  it('opens privacy policy on click', () => {
    const { wrapper } = givenSignUpTestRenderer()
    fireEvent.press(wrapper.root.findByProps({ text: strings.auth.privacy_policy }))
    expect(Linking.openURL).toBeCalledTimes(1)
    expect(Linking.openURL).toBeCalledWith(strings.auth.privacy_policy_url)
  })
})
