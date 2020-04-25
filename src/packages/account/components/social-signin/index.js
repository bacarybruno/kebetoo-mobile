import React, { useCallback } from 'react'
import { View, TouchableOpacity, Image } from 'react-native'

import HrLine from 'Kebetoo/src/packages/account/components/hr-line'
import googleLogin from 'Kebetoo/src/shared/helpers/google-login'
import facebookLogin from 'Kebetoo/src/shared/helpers/facebook-login'
import Kebeticon from 'Kebetoo/src/shared/icons/kebeticons'

import styles from './styles'
import images from 'Kebetoo/src/theme/images'
import colors from 'Kebetoo/src/theme/colors'

const SocialSignIn = ({ sectionText, onSignIn = () => {}, children }) => {
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
              <Kebeticon name="facebook" color={colors.facebook} size={33} />
            </TouchableOpacity>
            <TouchableOpacity onPress={signInWithGoogle}>
              <Image style={styles.googleIcon} source={images.google_icon} />
            </TouchableOpacity>
          </View>
        </View>
        {children}
      </View>
    </View>
  )
}

export default SocialSignIn
