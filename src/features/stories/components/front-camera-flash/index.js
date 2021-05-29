
import { useEffect, useState } from 'react'
import { View, Platform } from 'react-native'
import ScreenBrightness from '@adrianso/react-native-device-brightness'

import { useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'

const FrontCameraFlash = () => {
  if (!Platform.OS === 'android') return

  const styles = useAppStyles(createThemedStyles)
  const [brithness, setBrightness] = useState(0.5)

  useEffect(() => {
    ScreenBrightness.getSystemBrightnessLevel().then(setBrightness)
    ScreenBrightness.setBrightnessLevel(1)

    return () => {
      ScreenBrightness.setBrightnessLevel(brithness)
    }
  }, [])

  return <View style={styles.frontCameraFlash} />
}

export default FrontCameraFlash
