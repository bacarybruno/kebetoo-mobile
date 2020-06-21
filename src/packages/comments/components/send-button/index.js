import React from 'react'
import { TouchableOpacity, ActivityIndicator } from 'react-native'
import colors from 'Kebetoo/src/theme/colors'
import Ionicon from 'react-native-vector-icons/Ionicons'

import IconButton from 'Kebetoo/src/packages/post/components/icon-button'

import styles from './styles'

export const SendButton = React.memo(({ onPress, isLoading }) => (
  <TouchableOpacity style={styles.send} onPress={isLoading ? undefined : onPress}>
    {isLoading
      ? <ActivityIndicator size={25} color={colors.white} />
      : (
        <Ionicon style={styles.sendIcon} name="md-send" size={25} color={colors.white} />
      )}
  </TouchableOpacity>
))

export const RecordButton = React.memo(({ isRecording, start, stop }) => (
  <IconButton
    activable
    size={50}
    name="microphone"
    defaultHitSlop={0}
    color={colors.white}
    style={styles.recordButton}
    onPressIn={start}
    onPressOut={stop}
    isActive={isRecording}
    defaultBgColor={colors.primary}
  />
))
