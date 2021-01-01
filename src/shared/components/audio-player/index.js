import React, { useState, useCallback } from 'react'
import {
  TouchableOpacity, ActivityIndicator, View, Image,
} from 'react-native'
import { MediaStates } from '@react-native-community/audio-toolkit'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Player from 'react-native-sound'
import BackgroundTimer from 'react-native-background-timer'

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
    <TouchableOpacity style={styles.iconWrapper} onPress={onPress} {...otherProps}>
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
  duration, source, onDelete, round, onPress, player: instance, style = {},
}) => {
  const [player, setPlayer] = useState(instance)
  const [playerState, setPlayerState] = useState(MediaStates.IDLE)
  const [progress, setProgress] = useState(0)

  const styles = useAppStyles(createThemedStyles)

  const onEnd = useCallback((ended) => {
    if (ended) {
      setPlayerState(MediaStates.IDLE)
      BackgroundTimer.stopBackgroundTimer()
      setProgress(0)
      setPlayer(null)
    }
  }, [])

  const handleInterval = useCallback((soundPlayer) => {
    let totalTime = soundPlayer.getDuration()
    if (totalTime < 0) {
      totalTime = parseInt(duration, 10)
    }

    BackgroundTimer.runBackgroundTimer(() => {
      soundPlayer.getCurrentTime((currentTime) => {
        const currentProgress = (currentTime / totalTime) * 100
        setProgress(currentProgress < 100 ? currentProgress : 0)
      })
    }, 1)

    return () => {
      BackgroundTimer.stopBackgroundTimer()
    }
  }, [duration])

  const onPlayPause = useCallback(async () => {
    let playerInstance = null
    if (!player?.isLoaded()) {
      setPlayerState(MediaStates.PREPARING)
      playerInstance = await new Promise((resolve, reject) => {
        const newPlayer = new Player(source, undefined, (err) => {
          if (err) reject(err)
          else resolve(newPlayer)
        })
      })
      setPlayer(playerInstance)
    }
    const soundPlayer = player || playerInstance
    if (soundPlayer.isPlaying()) {
      soundPlayer.pause()
      setPlayerState(MediaStates.PAUSED)
    } else {
      soundPlayer.play(onEnd)
      handleInterval(soundPlayer)
      setPlayerState(MediaStates.PLAYING)
    }
  }, [handleInterval, onEnd, player, source])

  const onPressDelegate = useCallback(() => {
    if (!onPress) return onPlayPause()
    const bubbleEvent = onPress()
    if (bubbleEvent) {
      onPlayPause()
    }
    return true
  }, [onPress, onPlayPause])

  const { height, ...pressableStyle } = style
  return (
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
            text={readableSeconds(duration)}
            style={styles.duration}
          />
        </View>
      </Pressable>
      {onDelete && <DeleteIconButton onPress={onDelete} />}
    </View>
  )
}

export default React.memo(AudioPlayer)
