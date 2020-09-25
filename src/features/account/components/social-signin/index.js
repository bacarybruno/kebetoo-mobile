import React, { useCallback } from 'react'
import { View, TouchableOpacity, Image } from 'react-native'

import HrLine from '@app/features/account/components/hr-line'
import { googleLogin, facebookLogin } from '@app/shared/helpers'
import Kebeticon from '@app/shared/icons/kebeticons'
import { colors, images } from '@app/theme'
import { useAnalytics } from '@app/shared/hooks'

import styles from './styles'

const SocialSignIn = ({
  sectionText, children, onSignIn, onLoading, disabled, type,
}) => {
  const { trackSignIn, trackSignUp, reportError } = useAnalytics()

  const trackAuthEvent = useCallback((provider) => {
    if (type === 'signIn') {
      trackSignIn(provider)
    } else {
      trackSignUp(provider)
    }
  }, [trackSignIn, trackSignUp, type])

  const signInWithGoogle = useCallback(async () => {
    if (disabled) return false
    onLoading(true)
    const result = await googleLogin()
    if (result.error) {
      reportError(result.error)
    } else {
      trackAuthEvent('google.com')
    }
    onLoading(false)
    return onSignIn(result)
  }, [onLoading, onSignIn, disabled, trackAuthEvent, reportError])

  const signInWithFacebook = useCallback(async () => {
    if (disabled) return false
    onLoading(true)
    const result = await facebookLogin()
    if (result.error) {
      reportError(result.error)
    } else {
      trackAuthEvent('facebook.com')
    }
    onLoading(false)
    return onSignIn(result)
  }, [onLoading, onSignIn, disabled, trackAuthEvent, reportError])

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
