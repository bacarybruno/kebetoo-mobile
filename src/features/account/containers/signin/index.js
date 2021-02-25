import React, { useRef } from 'react'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {
  Logo, Typography, TextInput, PasswordInput, FullButton,
} from '@app/shared/components'
import SocialSignIn from '@app/features/account/components/social-signin'
import { metrics } from '@app/theme'
import { env, strings } from '@app/config'
import { useAppStyles } from '@app/shared/hooks'

import useSignin, { fieldNames } from './hook'
import createThemedStyles from './styles'

const SignIn = ({ navigation }) => {
  navigation.setOptions({ title: strings.auth.signin })

  const emailRef = useRef()
  const passwordRef = useRef()

  const {
    errors,
    focusPassword,
    isLoading,
    navigateToSignUp,
    onChangeText,
    onLoading,
    onSubmit,
    validate,
    handleAuthError,
  } = useSignin(navigation, passwordRef)

  const styles = useAppStyles(createThemedStyles)

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
            maxLength={env.maxLength.email}
            editable={!isLoading}
          />
          <PasswordInput
            placeholder={strings.auth.password}
            fieldName={fieldNames.password}
            onValueChange={onChangeText}
            ref={passwordRef}
            onBlur={validate}
            error={errors[fieldNames.password]}
            returnKeyType="done"
            maxLength={env.maxLength.password}
            editable={!isLoading}
          />
          <View>
            <FullButton
              text={strings.auth.signin.toUpperCase()}
              onPress={onSubmit}
              loading={isLoading}
            />
            <Typography
              color={Typography.colors.link}
              style={styles.forgotPassword}
              type={Typography.types.textButton}
              text={strings.auth.forgot_password}
            />
          </View>
        </View>
        <SocialSignIn
          sectionText={strings.auth.or_signin_with}
          onLoading={onLoading}
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
              color={Typography.colors.link}
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
