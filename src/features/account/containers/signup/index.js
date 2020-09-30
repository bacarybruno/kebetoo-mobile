import React, { useCallback, useState, useRef } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import auth from '@react-native-firebase/auth'
import * as yup from 'yup'

import {
  Typography, TextInput, PasswordInput, Logo, FullButton,
} from '@app/shared/components'
import routes from '@app/navigation/routes'
import SocialSignIn from '@app/features/account/components/social-signin'
import { SET_USER_PROFILE } from '@app/redux/types'
import { createUser } from '@app/shared/services/users'
import { strings } from '@app/config'
import { metrics } from '@app/theme'
import { useAnalytics } from '@app/shared/hooks'

import styles from './styles'

export const fieldNames = {
  fullName: 'fullName',
  email: 'email',
  password: 'password',
}

const SignUp = ({ navigation }) => {
  navigation.setOptions({ title: strings.auth.signup })

  const { trackSignUp, reportError } = useAnalytics()
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const [infos, setInfos] = useState({
    [fieldNames.fullName]: '',
    [fieldNames.email]: '',
    [fieldNames.password]: '',
  })

  const schema = yup.object().shape({
    [fieldNames.fullName]: yup.string().required(
      strings.formatString(strings.errors.required_field, strings.auth.fullname),
    ),
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

  const [errors, setErrors] = useState({
    [fieldNames.fullName]: null,
    [fieldNames.email]: null,
    [fieldNames.password]: null,
  })

  const fullNameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()

  const onChangeText = useCallback((value, field) => {
    setInfos((state) => ({ ...state, [field]: value }))
    setErrors((state) => ({ ...state, [field]: null }))
  }, [])

  const navigateToSignIn = useCallback(() => {
    navigation.navigate(routes.SIGNIN)
  }, [navigation])

  const focusEmail = useCallback(() => {
    emailRef.current.focus()
  }, [])

  const focusPassword = useCallback(() => {
    passwordRef.current.focus()
  }, [])

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true)
      await schema.validate(infos)
      const displayName = infos.fullName
      dispatch({ type: SET_USER_PROFILE, payload: { displayName } })

      const { user } = await auth().createUserWithEmailAndPassword(infos.email, infos.password)
      trackSignUp('password')
      await user.updateProfile({ displayName, photoURL: null })
      auth().currentUser = user

      await createUser({ id: user.uid, displayName, photoURL: null })
    } catch (error) {
      reportError(error)
    } finally {
      setIsLoading(false)
    }
  }, [schema, infos, dispatch, trackSignUp, reportError])

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
      extraHeight={80}
      extraScrollHeight={metrics.marginVertical}
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps="handled"
      style={styles.keyboard}
    >
      <View style={styles.wrapper}>
        <View style={styles.normalSignUp}>
          <Logo />
          <TextInput
            placeholder={strings.auth.fullname}
            fieldName={fieldNames.fullName}
            onValueChange={onChangeText}
            ref={fullNameRef}
            onSubmitEditing={focusEmail}
            onBlur={validate}
            error={errors[fieldNames.fullName]}
            returnKeyType="next"
          />
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
            onBlur={validate}
            error={errors[fieldNames.password]}
            ref={passwordRef}
            returnKeyType="done"
          />
          <FullButton
            text={strings.auth.signup.toUpperCase()}
            onPress={onSubmit}
            loading={isLoading}
          />
        </View>
        <SocialSignIn
          sectionText={strings.auth.or_signin_with}
          onLoading={setIsLoading}
          disabled={isLoading}
        >
          <View style={styles.footerText}>
            <Typography type={Typography.types.textButtonLight} text={strings.auth.have_account} />
            <Typography type={Typography.types.textButtonLight} text=" " />
            <Typography color="link" onPress={navigateToSignIn} type={Typography.types.textButton} text={strings.auth.signin} />
          </View>
        </SocialSignIn>
      </View>
    </KeyboardAwareScrollView>
  )
}

export default SignUp
