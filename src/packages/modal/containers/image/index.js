import React, { useEffect, useState } from 'react'
import { View, Image, StatusBar } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { TransitionPresets } from '@react-navigation/stack'

import { getSource } from 'Kebetoo/src/packages/post/components/image-content'
import HeaderBack from 'Kebetoo/src/shared/components/header-back'
import colors from 'Kebetoo/src/theme/colors'

import styles from './styles'

export const routeOptions = {
  title: '',
  headerShown: true,
  headerBackImage: () => (
    <HeaderBack tintColor={colors.white} />
  ),
  headerTransparent: true,
  ...TransitionPresets.ScaleFromCenterAndroid,
}

const ImageModal = ({ navigation }) => {
  navigation.setOptions(routeOptions)

  const { params } = useRoute()
  const { url, width, height } = params
  const source = getSource(url)
  const [aspectRatio, setAspectRatio] = useState(parseInt(width, 10) / parseInt(height, 10))

  useEffect(() => {
    if (Number.isNaN(aspectRatio)) {
      Image.getSize(source, (w, h) => {
        // set aspect ratio based on react native image size
        setAspectRatio(w / h)
      }, () => {
        // on error
        setAspectRatio(0)
      })
    }
  }, [aspectRatio, source])

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.wrapper}>
        <Image source={source} style={{ aspectRatio }} />
      </View>
    </>
  )
}

export default ImageModal
