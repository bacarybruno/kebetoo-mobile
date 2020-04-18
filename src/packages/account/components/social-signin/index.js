import React, { useCallback } from 'react'
import { View, TouchableOpacity, Image } from 'react-native'

import HrLine from 'Kebetoo/src/packages/account/components/hr-line'
import googleLogin from 'Kebetoo/src/shared/helpers/google-login'
import facebookLogin from 'Kebetoo/src/shared/helpers/facebook-login'
import styles from './styles'

export default ({ sectionText, onSignIn, children }) => {
  const signInWithGoogle = useCallback(async () => {
    const result = await googleLogin()
    return onSignIn(result)
  }, [onSignIn])

  const signInWithFacebook = useCallback(async () => {
    const result = await facebookLogin()
    return onSignIn(result)
  }, [onSignIn])

  return (
    <View style={styles.socialSignUp}>
      <View style={styles.socialSignUpContainer}>
        <View style={styles.socialSignUpContent}>
          <HrLine text={sectionText} />
          <View style={styles.socialSignUpButtons}>
            <TouchableOpacity onPress={signInWithFacebook}>
              <Image
                style={styles.socialLoginButton}
                source={require('Kebetoo/assets/images/facebook.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={signInWithGoogle}>
              <Image
                style={styles.socialLoginButton}
                source={require('Kebetoo/assets/images/google.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        {children}
      </View>
    </View>
  )
}
