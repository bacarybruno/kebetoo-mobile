import React, { useCallback, useState, useRef } from 'react'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import auth from '@react-native-firebase/auth'
import * as yup from 'yup'

import Typography, { types } from '@app/shared/components/typography'
import TextInput from '@app/shared/components/inputs/text'
import PasswordInput from '@app/shared/components/inputs/password'
import FullButton from '@app/shared/components/buttons/full'
import SocialSignIn from '@app/features/account/components/social-signin'
import metrics from '@app/theme/metrics'
import routes from '@app/navigation/routes'
import Logo from '@app/shared/components/logo'
import strings from '@app/config/strings'
import { createUser } from '@app/shared/helpers/users'
import styles from './styles'

export const fieldNames = {
  email: 'email',
  password: 'password',
}

const SignIn = ({ navigation }) => {
  navigation.setOptions({ title: strings.auth.signin })

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

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true)
      await schema.validate(infos)
      const { user } = await auth().signInWithEmailAndPassword(infos.email, infos.password)
      await createUser({ id: user.uid, displayName: user.displayName, photoURL: user.photoURL })
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }, [schema, infos])

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
      extraScrollHeight={metrics.marginVertical}
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
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
              type={types.textButton}
              text={strings.auth.forgot_password}
            />
          </View>
        </View>
        <SocialSignIn
          sectionText={strings.auth.or_signin_with}
          onLoading={setIsLoading}
          disabled={isLoading}
        >
          <View style={styles.footerText}>
            <Typography type={types.textButtonLight} text={strings.auth.dont_have_account} />
            <Typography type={types.textButtonLight} text=" " />
            <Typography onPress={navigateToSignUp} color="link" type={types.textButton} text={strings.auth.signup} />
          </View>
        </SocialSignIn>
      </View>
    </KeyboardAwareScrollView>
  )
}

export default SignIn
