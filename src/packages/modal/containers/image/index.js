import React from 'react'
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

const ImageModal = () => {
  const { params } = useRoute()
  const { url, width, height } = params

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.wrapper}>
        <Image source={getSource(url)} style={{ aspectRatio: width / height }} />
      </View>
    </>
  )
}

export default ImageModal
