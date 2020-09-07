import React, { useCallback, useState, useRef } from 'react'
import { View } from 'react-native'
import * as yup from 'yup'
import auth from '@react-native-firebase/auth'

import Typography, { types } from 'Kebetoo/src/shared/components/typography'
import TextInput from 'Kebetoo/src/shared/components/inputs/text'
import PasswordInput from 'Kebetoo/src/shared/components/inputs/password'
import FullButton from 'Kebetoo/src/shared/components/buttons/full'
import SocialSignIn from 'Kebetoo/src/features/account/components/social-signin'
import metrics from 'Kebetoo/src/theme/metrics'
import routes from 'Kebetoo/src/navigation/routes'
import { useKeyboard } from 'Kebetoo/src/shared/hooks'
import Logo from 'Kebetoo/src/shared/components/logo'
import strings from 'Kebetoo/src/config/strings'
import { createUser } from 'Kebetoo/src/shared/helpers/users'

import styles from './styles'

const SignIn = ({ navigation }) => {
  navigation.setOptions({ title: strings.auth.signin })

  const [isLoading, setIsLoading] = useState(false)

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

  const { keyboardShown, keyboardHeight } = useKeyboard()
  const availableHeight = metrics.screenHeight - keyboardHeight

  return (
    <View style={styles.wrapper}>
      <View style={styles.normalSignUp}>
        {availableHeight > 480 && <Logo />}
        <TextInput
          placeholder={strings.auth.email}
          fieldName="email"
          onValueChange={onChangeText}
          keyboardType="email-address"
          ref={emailRef}
          onSubmitEditing={focusPassword}
          returnKeyType="next"
        />
        <PasswordInput
          placeholder={strings.auth.password}
          fieldName="password"
          onValueChange={onChangeText}
          ref={passwordRef}
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
      {!keyboardShown && (
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
      )}
    </View>
  )
}

export default SignIn
