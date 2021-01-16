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
  const { colors, resetAppBars } = useAppColors()
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
    resetAppBars()
    if (!unmount) navigation.goBack()
  }, [navigation, resetAppBars, showControls])

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
      ignoreSilentSwitch="ignore"
      onShowControls={showControls}
      onHideControls={hideControls}
    />
  )
}

export default VideoModal
