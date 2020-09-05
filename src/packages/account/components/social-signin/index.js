import React, { useCallback } from 'react'
import { View, TouchableOpacity, Image } from 'react-native'

import HrLine from 'Kebetoo/src/packages/account/components/hr-line'
import googleLogin from 'Kebetoo/src/shared/helpers/google-login'
import facebookLogin from 'Kebetoo/src/shared/helpers/facebook-login'
import Kebeticon from 'Kebetoo/src/shared/icons/kebeticons'
import images from 'Kebetoo/src/theme/images'
import colors from 'Kebetoo/src/theme/colors'

import styles from './styles'

const SocialSignIn = ({
  sectionText, children, onSignIn, onLoading,
}) => {
  const signInWithGoogle = useCallback(async () => {
    onLoading(true)
    const result = await googleLogin()
    onLoading(false)
    return onSignIn(result)
  }, [onLoading, onSignIn])

  const signInWithFacebook = useCallback(async () => {
    onLoading(true)
    const result = await facebookLogin()
    onLoading(false)
    return onSignIn(result)
  }, [onLoading, onSignIn])

  return (
    <View style={styles.socialSignUp}>
      <View style={styles.socialSignUpContainer}>
        <View style={styles.socialSignUpContent}>
          <HrLine text={sectionText} />
          <View style={styles.socialSignUpButtons}>
            <TouchableOpacity testID="facebook-signin" onPress={signInWithFacebook}>
              <Kebeticon name="facebook" color={colors.facebook} size={33} />
            </TouchableOpacity>
            <TouchableOpacity testID="google-signin" onPress={signInWithGoogle}>
              <Image style={styles.googleIcon} source={images.google_icon} />
            </TouchableOpacity>
          </View>
        </View>
        {children}
      </View>
    </View>
  )
}

SocialSignIn.defaultProps = {
  onSignIn: () => {},
  onLoading: () => {},
}

export default SocialSignIn
