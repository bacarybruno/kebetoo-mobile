import React from 'react'
import { fireEvent } from 'react-native-testing-library'
import { act } from 'react-test-renderer'
import auth from '@react-native-firebase/auth'

import setupTest from '@app/config/jest-setup'
import strings from '@app/config/strings'
import Typography, { types } from '@app/shared/components/typography'

import SocialSignin from '../index'

const givenSocialSignin = setupTest(SocialSignin)({
  text: strings.auth.or_signin_with,
  onSignIn: jest.fn(),
  children: <Typography text={strings.auth.dont_have_account} type={types.textButton} />,
  type: 'signIn',
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

  const testProvider = async (testID, onSignIn, type) => {
    const { wrapper, props } = givenSocialSignin({
      onSignIn,
      type,
    })
    const signinButton = wrapper.root.findByProps({ testID })
    await act(async () => {
      await fireEvent.press(signinButton)
    })
    return props
  }

  test('with google', async () => {
    const onSignIn = jest.fn()
    await testProvider('google-signin', onSignIn, 'signIn')
    expect(onSignIn).toBeCalledTimes(1)
    expect(onSignIn).toBeCalledWith(onSignInPayload)
  })

  test('with facebook', async () => {
    const onSignIn = jest.fn()
    await testProvider('facebook-signin', onSignIn, 'signUp')
    expect(onSignIn).toBeCalledTimes(1)
    expect(onSignIn).toBeCalledWith(onSignInPayload)
  })

  test('without handler', async () => {
    const props = await testProvider('facebook-signin', undefined)
    expect(props.onSignIn).not.toBeDefined()
  })
})
