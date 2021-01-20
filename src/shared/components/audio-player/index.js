import React, { useState, useCallback, useRef } from 'react'
import {
  TouchableOpacity, ActivityIndicator, View, Image,
} from 'react-native'
import Video from 'react-native-video'
import { MediaStates } from '@react-native-community/audio-toolkit'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { edgeInsets, images } from '@app/theme'
import { Pressable } from '@app/shared/components'
import { readableSeconds } from '@app/shared/helpers/dates'
import { useAppColors, useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'
import Typography from '../typography'

const Waves = () => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.wavesContainer}>
      <Image style={styles.waves} source={images.waves} />
    </View>
  )
}

export const PlayButton = ({ onPress, state, ...otherProps }) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  return (
    <TouchableOpacity
      hitSlop={edgeInsets.all(10)}
      style={styles.iconWrapper}
      onPress={onPress}
      {...otherProps}
    >
      {state === MediaStates.PREPARING
        ? (
          <ActivityIndicator color={colors.blue_dark} />
        ) : (
          <Ionicon
            name={state === MediaStates.PLAYING ? 'ios-pause' : 'ios-play'}
            size={22}
            color={colors.blue_dark}
          />
        )}
    </TouchableOpacity>
  )
}

export const DeleteIconButton = ({ onPress }) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()
  return (
    <TouchableOpacity style={styles.deleteWrapper} onPress={onPress} hitSlop={edgeInsets.all(50)}>
      <Ionicon name="ios-close" size={20} color={colors.textPrimary} />
    </TouchableOpacity>
  )
}

// TODO: cleanup on component unmount
export const AudioPlayer = ({
  duration, source, onDelete, round, onPress, style = {},
}) => {
  const [playerState, setPlayerState] = useState(MediaStates.IDLE)
  const [progress, setProgress] = useState(0)
  const [audioDuration, setAudioDuration] = useState(duration)
  const [prepared, setPrepared] = useState(false)

  const videoRef = useRef()

  const styles = useAppStyles(createThemedStyles)

  const onEnd = useCallback(() => {
    setPlayerState(MediaStates.IDLE)
    setProgress(0)
    // seek after a certain amount of time to avoid looping
    setTimeout(() => {
      videoRef.current?.seek(0)
    }, 100)
  }, [])

  const onPlayPause = useCallback(() => {
    if (!prepared) setPrepared(true)
    setPlayerState((state) => (
      state === MediaStates.PLAYING
        ? MediaStates.PAUSED
        : MediaStates.PLAYING
    ))
  }, [prepared])

  const onPressDelegate = useCallback(() => {
    if (!onPress) return onPlayPause()
    const bubbleEvent = onPress()
    if (bubbleEvent) {
      onPlayPause()
    }
    return true
  }, [onPress, onPlayPause])

  const onProgress = useCallback((data) => {
    const currentProgress = (data.currentTime / audioDuration) * 100
    setProgress(currentProgress < 100 ? currentProgress : 0)
  }, [audioDuration])

  const onLoad = useCallback((data) => {
    setPlayerState(MediaStates.PREPARED)
    // we can play the audio right away
    // because it is preloaded when the user clicks the play button
    setPlayerState(MediaStates.PLAYING)
    setAudioDuration(data.duration)
  }, [])

  const { height, ...pressableStyle } = style
  return (
    <>
      {prepared && (
        <Video
          audioOnly
          onEnd={onEnd}
          ref={videoRef}
          testID="audio-player"
          onProgress={onProgress}
          source={{ uri: source }}
          ignoreSilentSwitch="ignore"
          progressUpdateInterval={10}
          onAudioBecomingNoisy={() => setPlayerState(MediaStates.PAUSED)}
          paused={playerState !== MediaStates.PLAYING}
          onLoadStart={() => setPlayerState(MediaStates.PREPARING)}
          onError={() => setPlayerState(MediaStates.ERROR)}
          onLoad={onLoad}
        />
      )}
      <View style={[styles.audio, height && { height }]}>
        <Pressable
          foreground
          onPress={onPressDelegate}
          style={[styles.audioWrapper, pressableStyle, round && styles.round]}
          testID="player-wrapper"
        >
          <View style={styles.audioContent}>
            <View testID="progress" style={{ ...styles.progress, width: `${progress}%` }} />
            <PlayButton state={playerState} onPress={onPlayPause} />
            <Waves />
            <Typography
              type={Typography.types.headline6}
              text={readableSeconds(audioDuration)}
              style={styles.duration}
            />
          </View>
        </Pressable>
        {onDelete && <DeleteIconButton onPress={onDelete} />}
      </View>
    </>
  )
}

export default React.memo(AudioPlayer)
