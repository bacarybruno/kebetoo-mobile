import { render, fireEvent } from 'react-native-testing-library'
import auth from '@react-native-firebase/auth'

import setupTest from 'Kebetoo/src/config/jest-setup'
import strings from 'Kebetoo/src/config/strings'
import routes from 'Kebetoo/src/navigation/routes'

import SignIn from '../index'

afterEach(jest.clearAllMocks)

const userInfos = {
  email: 'bacarybruno@kebetoo.com',
  password: 'Kebetoo!',
}

const givenSignIn = setupTest(SignIn, render)({
  navigation: {
    setOptions: jest.fn(),
    navigate: jest.fn(),
  },
})

it('renders Signin', () => {
  const { wrapper } = givenSignIn()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

test('screen title', () => {
  const { props } = givenSignIn()
  expect(props.navigation.setOptions).toBeCalledTimes(1)
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
    signInButton: wrapper.getByText(strings.auth.signup.toUpperCase()),
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
