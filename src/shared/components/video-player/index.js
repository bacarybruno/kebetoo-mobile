import React, {
  useCallback, useEffect, useRef, useState,
} from 'react'
import { Image, View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { useAppColors, useAppStyles } from '@app/shared/hooks'
import { readableSeconds } from '@app/shared/helpers/dates'
import { metrics } from '@app/theme'
import routes from '@app/navigation/routes'

import createThemedStyles from './styles'
import Badge from '../badge'

const VideoPlayer = ({
  source, localSource, duration, thumbnail, preview,
}) => {
  const navigation = useNavigation()
  const styles = useAppStyles(createThemedStyles)
  const colors = useAppColors()
  const componentRef = useRef()

  const intervalDelay = 300
  const videoPreviewShowDelay = 3000

  const [visibilityThresold, setVisibilityThresold] = useState(0)
  const shouldAnimate = visibilityThresold >= (videoPreviewShowDelay / intervalDelay)
  const imageSource = localSource || (shouldAnimate ? preview : thumbnail)

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!componentRef.current) return
      componentRef.current.measure((x, y, width, height, pageX, pageY) => {
        const rect = {
          top: pageY,
          bottom: pageY + height,
          width: pageX + width,
        }
        const visible = rect.bottom !== 0
          && rect.top >= 0
          && rect.bottom <= metrics.screenHeight
          && rect.width > 0
          && rect.width <= metrics.screenWidth
        setVisibilityThresold((state) => {
          if (shouldAnimate && visible) return state
          return (visible ? state + 1 : 0)
        })
      })
    }, intervalDelay)

    return () => clearInterval(intervalId)
  }, [shouldAnimate])

  const onPlayVideo = useCallback(() => {
    navigation.navigate(routes.MODAL_VIDEO, { source, poster: thumbnail })
  }, [navigation, source, thumbnail])

  return (
    <View style={styles.wrapper} ref={componentRef}>
      <Image
        source={{ uri: imageSource }}
        style={styles.thumbnail}
        resizeMode="cover"
        fadeDuration={0}
      />
      <View style={styles.touchableOverlay}>
        <TouchableOpacity style={styles.touchable} onPress={onPlayVideo}>
          <Ionicon name="ios-play" size={45} color={colors.white} />
        </TouchableOpacity>
        <Badge primary text={readableSeconds(duration)} style={styles.badge} />
      </View>
    </View>
  )
}

export default VideoPlayer
