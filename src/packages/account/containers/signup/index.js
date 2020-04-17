import React, { useCallback, useState, useRef } from 'react'
import { View, Text } from 'react-native'
import * as yup from 'yup'

import TextInput from 'Kebetoo/src/shared/components/inputs/text'
import PasswordInput from 'Kebetoo/src/shared/components/inputs/password'
import FullButton from 'Kebetoo/src/shared/components/buttons/full'
import Metrics from 'Kebetoo/src/theme/metrics'
import routes from 'Kebetoo/src/navigation/routes'
import SocialSignIn from 'Kebetoo/src/packages/account/components/social-signin'

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
      const validation = await schema.validate(infos)
    } catch (e) {
      console.log(e.errors)
    }
  }, [schema, infos])

  const { keyboardShown, keyboardHeight } = useKeyboard()
  const availableHeight = Metrics.screenHeight - keyboardHeight

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
        <SocialSignIn
          onSignIn={(infos) => console.log(infos.data.user)}
          sectionText="Or sign up with"
        >
          <Text style={styles.footerText} onPress={navigateToSignIn}>
            Have an account ? <Text style={styles.linkButton}>Sign in</Text>
          </Text>
        </SocialSignIn>
      )}
    </View>
  )
}
