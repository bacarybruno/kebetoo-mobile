import React, { useEffect, useState } from 'react'
import { View, Image, StatusBar } from 'react-native'
import { TransitionPresets } from '@react-navigation/stack'

import { metrics } from '@app/theme'
import { HeaderBack } from '@app/shared/components'
import { useAppColors, useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'

export const routeOptions = (colors) => ({
  title: '',
  headerShown: true,
  headerBackImage: () => (
    <HeaderBack tintColor={colors.white} />
  ),
  headerTransparent: true,
  ...TransitionPresets.ScaleFromCenterAndroid,
})

const isGoogleImageUrl = (url) => url.includes('googleusercontent.com')

const ImageModal = ({ route, navigation }) => {
  const styles = useAppStyles(createThemedStyles)
  const colors = useAppColors()
  navigation.setOptions(routeOptions(colors))

  const { params } = route
  const { source, width, height } = params
  const [aspectRatio, setAspectRatio] = useState(parseInt(width, 10) / parseInt(height, 10))

  source.uri = isGoogleImageUrl(source.uri) ? source.uri.replace('s96-c', 's400-c') : source.uri

  useEffect(() => {
    if (Number.isNaN(aspectRatio)) {
      Image.getSize(source.uri, (w, h) => {
        // set aspect ratio based on react native image size
        setAspectRatio(w / h)
      }, () => {
        // on error
        setAspectRatio(0)
      })
    }
  }, [aspectRatio, source.uri])

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.wrapper}>
        <Image
          source={source}
          style={{ aspectRatio: aspectRatio || metrics.aspectRatio.vertical }}
        />
      </View>
    </>
  )
}

export default ImageModal
