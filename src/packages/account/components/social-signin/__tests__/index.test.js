import React from 'react'
import { fireEvent } from 'react-native-testing-library'
import { act } from 'react-test-renderer'
import auth from '@react-native-firebase/auth'

import setupTest from 'Kebetoo/src/config/jest-setup'
import strings from 'Kebetoo/src/config/strings'
import Text from 'Kebetoo/src/shared/components/text'

import SocialSignin from '../index'

const givenSocialSignin = setupTest(SocialSignin)({
  text: strings.auth.or_signin_with,
  onSignIn: jest.fn(),
  children: <Text text={strings.auth.dont_have_account} />,
})

it('renders SocialSignin', () => {
  const { wrapper } = givenSocialSignin()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

describe('sign in', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const onSignInPayload = expect.objectContaining({
    data: auth().credentials,
    error: null,
  })

  const testProvider = async (testID) => {
    const { wrapper, props } = givenSocialSignin()
    const signinButton = wrapper.root.findByProps({ testID })
    await act(async () => {
      await fireEvent.press(signinButton)
    })
    return props.onSignIn
  }

  test('with google', async () => {
    const onSignIn = await testProvider('google-signin')
    expect(onSignIn).toBeCalledTimes(1)
    expect(onSignIn).toBeCalledWith(onSignInPayload)
  })

  test('with facebook', async () => {
    const onSignIn = await testProvider('facebook-signin')
    expect(onSignIn).toBeCalledTimes(1)
    expect(onSignIn).toBeCalledWith(onSignInPayload)
  })
})
