import React, { useRef } from 'react'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {
  Typography, TextInput, PasswordInput, Logo, FullButton,
} from '@app/shared/components'
import SocialSignIn from '@app/features/account/components/social-signin'
import { strings } from '@app/config'
import { metrics } from '@app/theme'

import styles from './styles'
import useSignUp from './hook'

export const fieldNames = {
  fullName: 'fullName',
  email: 'email',
  password: 'password',
}

const SignUp = ({ navigation }) => {
  navigation.setOptions({ title: strings.auth.signup })

  const fullNameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()

  const {
    errors,
    focusEmail,
    focusPassword,
    handleAuthError,
    isLoading,
    navigateToSignIn,
    onChangeText,
    onLoading,
    onSubmit,
    validate,
  } = useSignUp(navigation, emailRef, passwordRef)

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
          onLoading={onLoading}
          disabled={isLoading}
          onError={handleAuthError}
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
