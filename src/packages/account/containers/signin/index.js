import React, { useCallback, useState, useRef } from 'react'
import { View } from 'react-native'
import * as yup from 'yup'
import auth from '@react-native-firebase/auth'

import Text from 'Kebetoo/src/shared/components/text'
import TextInput from 'Kebetoo/src/shared/components/inputs/text'
import PasswordInput from 'Kebetoo/src/shared/components/inputs/password'
import FullButton from 'Kebetoo/src/shared/components/buttons/full'
import SocialSignIn from 'Kebetoo/src/packages/account/components/social-signin'
import metrics from 'Kebetoo/src/theme/metrics'
import routes from 'Kebetoo/src/navigation/routes'
import { useKeyboard } from 'Kebetoo/src/shared/hooks'

import styles from './styles'

export const routeOptions = { title: 'Sign in' }

export default ({ navigation }) => {
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(8),
  })

  const [infos, setInfos] = useState({
    email: '',
    password: '',
  })

  const emailRef = useRef()
  const passwordRef = useRef()

  const onChangeText = useCallback((value, field) => {
    setInfos((oldInfos) => ({ ...oldInfos, [field]: value }))
  }, [setInfos])

  const onSubmit = useCallback(async () => {
    try {
      await schema.validate(infos)
      await auth().signInWithEmailAndPassword(infos.email, infos.password)
    } catch (e) {
      console.log(e)
    }
  }, [schema, infos])

  const navigateToSignUp = useCallback(() => {
    navigation.navigate(routes.SIGNUP)
  }, [navigation])

  const focusInput = useCallback((ref) => () => {
    ref.current.focus()
  }, [])

  const { keyboardShown, keyboardHeight } = useKeyboard()
  const availableHeight = metrics.screenHeight - keyboardHeight

  return (
    <View style={styles.wrapper}>
      <View style={styles.normalSignUp}>
        {availableHeight > 480 && <View style={styles.logo} />}
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
        <View>
          <FullButton text="SIGN IN" onPress={onSubmit} />
          <Text
            style={styles.forgotPassword}
            text="Forgot your password ?"
            color="secondary"
          />
        </View>
      </View>
      {!keyboardShown && (
        <SocialSignIn
          onSignIn={(infos) => console.log(infos)}
          sectionText="Or sign in with"
        >
          <Text style={styles.footerText} onPress={navigateToSignUp}>
            Don't have an account ? <Text color="secondary" text="Sign up" />
          </Text>
        </SocialSignIn>
      )}
    </View>
  )
}
