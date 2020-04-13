import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'
import * as yup from 'yup'
import TextInput from '../../../shared/components/inputs/text'
import PasswordInput from '../../../shared/components/inputs/password'
import FullButton from '../../../shared/components/buttons/full'
import HrLine from '../../components/hr-line'
import styles from './styles'
import { useKeyboard } from '../../../shared/hooks'

import { routeName as signUpRouteName } from '../signup'

export const routeName = 'Sign in'
export const routeOptions = {}

export default ({ navigation }) => {
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(8),
  })

  const [infos, setInfos] = useState({
    email: '',
    password: '',
  })

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
    navigation.navigate(signUpRouteName)
  }, [navigation])

  const keyboardShown = useKeyboard()

  return (
    <View style={styles.wrapper}>
      <View style={styles.normalSignUp}>
        <View style={styles.logo} />
        <TextInput
          placeholder="Email"
          fieldName="email"
          onValueChange={onChangeText}
          keyboardType="email-address"
          returnKeyType="next"
        />
        <PasswordInput
          placeholder="Password"
          fieldName="password"
          onValueChange={onChangeText}
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
                    source={require('../../../../../assets/images/facebook.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    style={styles.socialLoginButton}
                    source={require('../../../../../assets/images/google.png')}
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
