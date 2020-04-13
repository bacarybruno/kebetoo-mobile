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

import { routeName as signUpRouteName } from '../signin'

export const routeName = 'Sign up'
export const routeOptions = {}

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

  const onChangeText = useCallback((field) => (value) => {
    setInfos({
      ...infos,
      [field]: value,
    })
  }, [infos, setInfos])

  const navigateToSignIn = useCallback(() => {
    navigation.navigate(signUpRouteName)
  }, [navigation])

  const onSubmit = useCallback(async () => {
    try {
      const validation = await schema.validate(infos)
    } catch (e) {
      console.log(e.errors)
    }
  }, [schema, infos])

  return (
    <View style={styles.wrapper}>
      <View style={styles.normalSignUp}>
        <View style={styles.logo} />
        <TextInput
          placeholder="Full Name"
          onChangeText={onChangeText('fullName')}
          returnKeyType="next"
        />
        <TextInput
          placeholder="Email"
          onChangeText={onChangeText('email')}
          returnKeyType="next"
        />
        <PasswordInput
          placeholder="Password"
          onChangeText={onChangeText('password')}
          returnKeyType="done"
        />
        <FullButton
          text="SIGN UP"
          onPress={onSubmit}
        />
      </View>
      <View style={styles.socialSignUp}>
        <View style={styles.socialSignUpContainer}>
          <View style={styles.socialSignUpContent}>
            <HrLine
              textStyle={styles.hrLineText}
              text="Or sign up with"
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
          <Text style={styles.footerText} onPress={navigateToSignIn}>
            Have an account ? <Text style={styles.linkButton}>Sign in</Text>
          </Text>
        </View>
      </View>
    </View>
  )
}
