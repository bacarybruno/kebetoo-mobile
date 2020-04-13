import React, { useCallback, useState, useRef } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'
import * as yup from 'yup'

import TextInput from 'Kebetoo/src/shared/components/inputs/text'
import PasswordInput from 'Kebetoo/src/shared/components/inputs/password'
import FullButton from 'Kebetoo/src/shared/components/buttons/full'
import HrLine from 'Kebetoo/src/packages/account/components/hr-line'
import Metrics from 'Kebetoo/src/theme/metrics'
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
      const validation = await schema.validate(infos)
    } catch (e) {
      console.log(e.errors)
    }
  }, [schema, infos])

  const navigateToSignUp = useCallback(() => {
    navigation.navigate(routes.SIGNUP)
  }, [navigation])

  const focusInput = useCallback((ref) => () => {
    ref.current.focus()
  }, [])

  const { keyboardShown, keyboardHeight } = useKeyboard()
  const availableHeight = Metrics.screenHeight - keyboardHeight

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
          <Text style={[styles.linkButton, styles.forgotPassword]}>Forgot your password ?</Text>
        </View>
      </View>
      {!keyboardShown && (
        <View style={styles.socialSignUp}>
          <View style={styles.socialSignUpContainer}>
            <View style={styles.socialSignUpContent}>
              <HrLine
                textStyle={styles.hrLineText}
                text="Or sign in with"
              />
              <View style={styles.socialSignUpButtons}>
                <TouchableOpacity onPress={() => { }}>
                  <Image
                    style={styles.socialLoginButton}
                    source={require('Kebetoo/assets/images/facebook.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    style={styles.socialLoginButton}
                    source={require('Kebetoo/assets/images/google.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.footerText} onPress={navigateToSignUp}>
              Don't have an account ? <Text style={styles.linkButton}>Sign up</Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}
