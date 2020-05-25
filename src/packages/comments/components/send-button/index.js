import React from 'react'
import { TouchableOpacity } from 'react-native'
import colors from 'Kebetoo/src/theme/colors'
import Ionicon from 'react-native-vector-icons/Ionicons'

import IconButton from 'Kebetoo/src/packages/post/components/icon-button'

import styles from './styles'

export const SendButton = ({ onPress }) => (
  <TouchableOpacity style={styles.send} onPress={onPress}>
    <Ionicon
      style={styles.sendIcon}
      name="md-send"
      size={25}
      color={colors.white}
    />
  </TouchableOpacity>
)

export const RecordButton = ({ audioRecorder }) => (
  <IconButton
    activable
    size={50}
    name="microphone"
    defaultHitSlop={0}
    color={colors.white}
    style={styles.recordButton}
    onPressIn={audioRecorder.start}
    onPressOut={audioRecorder.stop}
    isActive={audioRecorder.isRecording}
    defaultBgColor={colors.primary}
  />
)
