import React from 'react'
import { TouchableOpacity, ActivityIndicator } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import IconButton from '@app/features/post/components/icon-button'
import { useAppColors, useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'

export const SendButton = React.memo(({ onPress, isLoading, ...otherProps }) => {
  const styles = useAppStyles(createThemedStyles)
  const colors = useAppColors()
  return (
    <TouchableOpacity style={styles.send} onPress={isLoading ? undefined : onPress} {...otherProps}>
      {isLoading
        ? <ActivityIndicator size={25} color={colors.white} />
        : (
          <Ionicon style={styles.sendIcon} name="md-send" size={25} color={colors.white} />
        )}
    </TouchableOpacity>
  )
})

export const RecordButton = React.memo(({ isRecording, start, stop }) => {
  const styles = useAppStyles(createThemedStyles)
  const colors = useAppColors()
  return (
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
  )
})
