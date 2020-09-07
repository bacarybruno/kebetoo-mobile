import React, { useCallback, useState, useRef } from 'react'
import { View } from 'react-native'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import auth from '@react-native-firebase/auth'

import Typography, { types } from '@app/shared/components/typography'
import TextInput from '@app/shared/components/inputs/text'
import PasswordInput from '@app/shared/components/inputs/password'
import FullButton from '@app/shared/components/buttons/full'
import metrics from '@app/theme/metrics'
import routes from '@app/navigation/routes'
import SocialSignIn from '@app/features/account/components/social-signin'
import { SET_DISPLAY_NAME } from '@app/redux/types'
import { createUser } from '@app/shared/helpers/users'
import { useKeyboard } from '@app/shared/hooks'
import Logo from '@app/shared/components/logo'
import strings from '@app/config/strings'

import styles from './styles'

const SignUp = ({ navigation }) => {
  navigation.setOptions({ title: strings.auth.signup })

  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const [infos, setInfos] = useState({
    fullName: '',
    email: '',
    password: '',
  })

  const schema = yup.object().shape({
    fullName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8),
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
      dispatch({ type: SET_DISPLAY_NAME, payload: displayName })

      const { user } = await auth().createUserWithEmailAndPassword(infos.email, infos.password)
      await user.updateProfile({ displayName, photoURL: null })
      auth().currentUser = user

      await createUser({ id: user.uid, displayName, photoURL: null })
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }, [schema, infos, dispatch])

  const { keyboardShown, keyboardHeight } = useKeyboard()
  const availableHeight = metrics.screenHeight - keyboardHeight

  return (
    <View style={styles.wrapper}>
      <View style={styles.normalSignUp}>
        {availableHeight > 480 && <Logo />}
        <TextInput
          placeholder={strings.auth.fullname}
          fieldName="fullName"
          onValueChange={onChangeText}
          ref={fullNameRef}
          onSubmitEditing={focusEmail}
          returnKeyType="next"
        />
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
        <FullButton
          text={strings.auth.signup.toUpperCase()}
          onPress={onSubmit}
          loading={isLoading}
        />
      </View>
      {!keyboardShown && (
        <SocialSignIn
          sectionText={strings.auth.or_signin_with}
          onLoading={setIsLoading}
          disabled={isLoading}
        >
          <View style={styles.footerText}>
            <Typography type={types.textButtonLight} text={strings.auth.have_account} />
            <Typography type={types.textButtonLight} text=" " />
            <Typography color="link" onPress={navigateToSignIn} type={types.textButton} text={strings.auth.signin} />
          </View>
        </SocialSignIn>
      )}
    </View>
  )
}

export default SignUp