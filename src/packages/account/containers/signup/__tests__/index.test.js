import React from 'react'
import { render, fireEvent } from 'react-native-testing-library'
import auth from '@react-native-firebase/auth'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

import setupTest from 'Kebetoo/src/config/jest-setup'
import strings from 'Kebetoo/src/config/strings'
import routes from 'Kebetoo/src/navigation/routes'

import SignUp from '../index'

afterEach(jest.clearAllMocks)

const userInfos = {
  fullName: 'Bruno Bodian',
  email: 'bacarybruno@kebetoo.com',
  password: 'Kebetoo!',
}

const mockStore = configureStore()
const store = mockStore()
const navigation = {
  setOptions: jest.fn(),
  navigate: jest.fn(),
}
const ConnectedSignUp = () => (
  <Provider store={store}>
    <SignUp navigation={navigation} />
  </Provider>
)

const givenSignUp = setupTest(ConnectedSignUp, render)({
  navigation: {
    setOptions: jest.fn(),
    navigate: jest.fn(),
  },
})

it('renders SignUp', () => {
  const { wrapper } = givenSignUp()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

test('screen title', () => {
  givenSignUp()
  expect(navigation.setOptions).toBeCalledTimes(1)
  expect(navigation.setOptions).toBeCalledWith({ title: strings.auth.signup })
})

it('navigates to signin', () => {
  const { wrapper } = givenSignUp()
  fireEvent.press(wrapper.getByText(strings.auth.signin))
  expect(navigation.navigate).toBeCalledTimes(1)
  expect(navigation.navigate).toBeCalledWith(routes.SIGNIN)
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
