import React, { useCallback } from 'react'
import { View, TouchableOpacity, Image } from 'react-native'

import HrLine from '@app/features/account/components/hr-line'
import { googleLogin, facebookLogin } from '@app/shared/services'
import Kebeticon from '@app/shared/icons/kebeticons'
import { images } from '@app/theme'
import { useAnalytics, useAppColors, useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'

const SocialSignIn = ({
  sectionText, children, onSignIn, onLoading, disabled, type, onError = () => { },
}) => {
  const colors = useAppColors()
  const styles = useAppStyles(createThemedStyles)

  const { trackSignIn, trackSignUp } = useAnalytics()

  const trackAuthEvent = useCallback((provider) => {
    if (type === 'signIn') {
      trackSignIn(provider)
    } else {
      trackSignUp(provider)
    }
  }, [trackSignIn, trackSignUp, type])

  const signInWithGoogle = useCallback(async () => {
    if (disabled) return false
    onLoading()
    const result = await googleLogin()
    if (result.error) {
      onError(result.error)
    } else {
      trackAuthEvent('google.com')
    }
    return onSignIn(result)
  }, [disabled, onLoading, onSignIn, onError, trackAuthEvent])

  const signInWithFacebook = useCallback(async () => {
    if (disabled) return false
    onLoading()
    const result = await facebookLogin()
    if (result.error) {
      onError(result.error)
    } else {
      trackAuthEvent('facebook.com')
    }
    return onSignIn(result)
  }, [onLoading, onSignIn, disabled, trackAuthEvent, onError])

  return (
    <View style={styles.socialSignUp}>
      <View style={styles.socialSignUpContainer}>
        <View style={styles.socialSignUpContent}>
          <HrLine text={sectionText} />
          <View style={styles.socialSignUpButtons}>
            <TouchableOpacity style={styles.facebookIconWrapper} testID="facebook-signin" onPress={signInWithFacebook}>
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
  onSignIn: () => { },
  onLoading: () => { },
}

export default SocialSignIn
