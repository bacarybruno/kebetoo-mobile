import React, { useCallback, useEffect, useRef } from 'react'
import { StatusBar } from 'react-native'
import { TransitionPresets } from '@react-navigation/stack'
import VideoPlayer from 'react-native-video-controls'

import { useAppColors } from '@app/shared/hooks'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import { rgbaToHex } from '@app/theme/colors'

export const routeOptions = {
  title: '',
  headerShown: false,
  headerTransparent: true,
  ...TransitionPresets.ScaleFromCenterAndroid,
}

const VideoModal = ({ route, navigation }) => {
  const colors = useAppColors()
  navigation.setOptions(routeOptions)
  const playerRef = useRef()
  const { source, poster } = route.params

  const showControls = useCallback(() => {
    StatusBar.setBarStyle('light-content')
  }, [])

  const hideControls = useCallback(() => {
    StatusBar.setBackgroundColor(colors.black)
    StatusBar.setBarStyle('dark-content')
    changeNavigationBarColor(rgbaToHex(colors.black))
  }, [colors.black])

  useEffect(() => {
    hideControls()
  }, [hideControls])

  const onBack = useCallback((unmount) => {
    showControls()
    StatusBar.setBarStyle(colors.colorScheme === 'dark' ? 'light-content' : 'dark-content')
    StatusBar.setBackgroundColor(colors.background)
    StatusBar.setHidden(false)
    changeNavigationBarColor(rgbaToHex(colors.background))
    if (!unmount) navigation.goBack()
  }, [colors.background, colors.colorScheme, navigation, showControls])

  // componentWillUnmount
  useEffect(() => () => {
    onBack(true)
  }, [])

  return (
    <VideoPlayer
      repeat
      disableVolume
      ref={playerRef}
      poster={poster}
      onBack={onBack}
      showOnStart={false}
      doubleTapTime={200}
      resizeMode="contain"
      controlTimeout={5000}
      navigator={navigation}
      source={{ uri: source }}
      seekColor={colors.primary}
      onShowControls={showControls}
      onHideControls={hideControls}
    />
  )
}

export default VideoModal
