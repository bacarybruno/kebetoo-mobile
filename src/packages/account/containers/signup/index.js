import React, { useCallback, useState, useRef } from 'react'
import { View } from 'react-native'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import auth from '@react-native-firebase/auth'

import Text from 'Kebetoo/src/shared/components/text'
import TextInput from 'Kebetoo/src/shared/components/inputs/text'
import PasswordInput from 'Kebetoo/src/shared/components/inputs/password'
import FullButton from 'Kebetoo/src/shared/components/buttons/full'
import metrics from 'Kebetoo/src/theme/metrics'
import routes from 'Kebetoo/src/navigation/routes'
import SocialSignIn from 'Kebetoo/src/packages/account/components/social-signin'
import { SET_DISPLAY_NAME } from 'Kebetoo/src/redux/types'

import { useKeyboard } from 'Kebetoo/src/shared/hooks'

import styles from './styles'

export const routeOptions = { title: 'Sign up' }

export default ({ navigation }) => {
  const schema = yup.object().shape({
    fullName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8),
  })

  const [infos, setInfos] = useState({
    fullName: '',
    email: '',
    password: '',
  })

  const fullNameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()

  const dispatch = useDispatch()

  const onChangeText = useCallback((value, field) => {
    setInfos((oldInfos) => ({ ...oldInfos, [field]: value }))
  }, [setInfos])

  const navigateToSignIn = useCallback(() => {
    navigation.navigate(routes.SIGNIN)
  }, [navigation])

  const focusInput = useCallback((ref) => () => {
    ref.current.focus()
  }, [])

  const onSubmit = useCallback(async () => {
    try {
      await schema.validate(infos)
      const { user } = await auth().createUserWithEmailAndPassword(infos.email, infos.password)
      const displayName = infos.fullName
      dispatch({ type: SET_DISPLAY_NAME, payload: displayName })
      await user.updateProfile({ displayName, photoURL: null })
      await auth().signInWithEmailAndPassword(infos.email, infos.password)
    } catch (e) {
      console.log(e)
    }
  }, [schema, infos, dispatch])

  const { keyboardShown, keyboardHeight } = useKeyboard()
  const availableHeight = metrics.screenHeight - keyboardHeight

  return (
    <View style={styles.wrapper}>
      <View style={styles.normalSignUp}>
        {availableHeight > 480 && <View style={styles.logo} />}
        <TextInput
          placeholder="Full Name"
          fieldName="fullName"
          onValueChange={onChangeText}
          ref={fullNameRef}
          onSubmitEditing={focusInput(emailRef)}
          returnKeyType="next"
        />
        <TextInput
          placeholder="Email"
          fieldName="email"
          onValueChange={onChangeText}
          keyboardType="email-address"
          ref={emailRef}
          onSubmitEditing={focusInput(passwordRef)}
          returnKeyType="next"
        />
        <PasswordInput
          placeholder="Password"
          fieldName="password"
          onValueChange={onChangeText}
          ref={passwordRef}
          returnKeyType="done"
        />
        <FullButton text="SIGN UP" onPress={onSubmit} />
      </View>
      {!keyboardShown && (
        <SocialSignIn sectionText="Or sign up with">
          <Text style={styles.footerText} onPress={navigateToSignIn}>
            Have an account ? <Text color="secondary" text="Sign in" />
          </Text>
        </SocialSignIn>
      )}
    </View>
  )
}
