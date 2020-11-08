import React, { useCallback, useState, useRef } from 'react'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import auth from '@react-native-firebase/auth'
import * as yup from 'yup'

import {
  Logo, Typography, TextInput, PasswordInput, FullButton,
} from '@app/shared/components'
import SocialSignIn from '@app/features/account/components/social-signin'
import { metrics } from '@app/theme'
import routes from '@app/navigation/routes'
import { strings } from '@app/config'
import { createUser } from '@app/shared/services/users'
import { useAnalytics } from '@app/shared/hooks'

import styles from './styles'

export const fieldNames = {
  email: 'email',
  password: 'password',
}

const SignIn = ({ navigation }) => {
  navigation.setOptions({ title: strings.auth.signin })

  const { trackSignIn, reportError } = useAnalytics()
  const [isLoading, setIsLoading] = useState(false)

  const schema = yup.object().shape({
    [fieldNames.email]: yup.string().email(
      strings.formatString(strings.errors.invalid_field, strings.auth.email),
    ).required(
      strings.formatString(strings.errors.required_field, strings.auth.email),
    ),
    [fieldNames.password]: yup.string().min(
      8,
      strings.formatString(strings.errors.min_length_field, strings.auth.password, 8),
    ),
  })

  const [infos, setInfos] = useState({
    [fieldNames.email]: '',
    [fieldNames.password]: '',
  })

  const [errors, setErrors] = useState({
    [fieldNames.email]: null,
    [fieldNames.password]: null,
  })

  const emailRef = useRef()
  const passwordRef = useRef()

  const onChangeText = useCallback((value, field) => {
    setInfos((state) => ({ ...state, [field]: value }))
    setErrors((state) => ({ ...state, [field]: null }))
  }, [])

  const handleAuthError = useCallback((error) => {
    switch (error.code) {
      case 'auth/user-not-found':
        setErrors((state) => ({
          ...state, [fieldNames.email]: strings.errors.auth_user_not_found,
        }))
        break
      case 'auth/wrong-password':
        setErrors((state) => ({
          ...state, [fieldNames.password]: strings.errors.auth_wrong_password,
        }))
        break
      case 'auth/user-disabled':
        setErrors((state) => ({
          ...state, [fieldNames.email]: strings.errors.auth_user_disabled,
        }))
        break
      case 'auth/account-exists-with-different-credential':
        setErrors((state) => ({
          ...state, [fieldNames.email]: strings.errors.auth_account_exists_different_credential,
        }))
        break
      case 'auth/network-request-failed':
        //TODO: handler network request fail
        break
      default:
        reportError(error)
        break
    }
  }, [reportError])

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true)
      await schema.validate(infos)
      const { user } = await auth().signInWithEmailAndPassword(infos.email, infos.password)
      trackSignIn('password')
      await createUser({ id: user.uid, displayName: user.displayName, photoURL: user.photoURL })
    } catch (error) {
      handleAuthError(error)
    } finally {
      setIsLoading(false)
    }
  }, [schema, infos, trackSignIn, handleAuthError])

  const navigateToSignUp = useCallback(() => {
    navigation.navigate(routes.SIGNUP)
  }, [navigation])

  const focusPassword = useCallback(() => {
    passwordRef.current.focus()
  }, [])

  const validate = useCallback((field) => {
    try {
      yup.reach(schema, field).validateSync(infos[field])
      setErrors((state) => ({ ...state, [field]: null }))
    } catch (error) {
      setErrors((state) => ({ ...state, [field]: error.message }))
    }
  }, [infos, schema])

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraScrollHeight={metrics.marginVertical}
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps="handled"
      style={styles.keyboard}
    >
      <View style={styles.wrapper}>
        <View style={styles.normalSignIn}>
          <Logo />
          <TextInput
            placeholder={strings.auth.email}
            fieldName={fieldNames.email}
            onValueChange={onChangeText}
            keyboardType="email-address"
            ref={emailRef}
            onSubmitEditing={focusPassword}
            onBlur={validate}
            error={errors[fieldNames.email]}
            returnKeyType="next"
          />
          <PasswordInput
            placeholder={strings.auth.password}
            fieldName={fieldNames.password}
            onValueChange={onChangeText}
            ref={passwordRef}
            onBlur={validate}
            error={errors[fieldNames.password]}
            returnKeyType="done"
          />
          <View>
            <FullButton
              text={strings.auth.signin.toUpperCase()}
              onPress={onSubmit}
              loading={isLoading}
            />
            <Typography
              color="link"
              style={styles.forgotPassword}
              type={Typography.types.textButton}
              text={strings.auth.forgot_password}
            />
          </View>
        </View>
        <SocialSignIn
          sectionText={strings.auth.or_signin_with}
          onLoading={setIsLoading}
          disabled={isLoading}
          onError={handleAuthError}
        >
          <View style={styles.footerText}>
            <Typography
              type={Typography.types.textButtonLight}
              text={strings.auth.dont_have_account}
            />
            <Typography type={Typography.types.textButtonLight} text=" " />
            <Typography
              onPress={navigateToSignUp}
              color="link"
              type={Typography.types.textButton}
              text={strings.auth.signup}
            />
          </View>
        </SocialSignIn>
      </View>
    </KeyboardAwareScrollView>
  )
}

export default SignIn
