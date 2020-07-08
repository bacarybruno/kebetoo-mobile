import React, { useState, useRef, useCallback } from 'react'
import {
  TouchableOpacity, ActivityIndicator, View, Image,
} from 'react-native'
import { MediaStates } from '@react-native-community/audio-toolkit'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Player from 'react-native-sound'

import images from 'Kebetoo/src/theme/images'
import colors from 'Kebetoo/src/theme/colors'
import edgeInsets from 'Kebetoo/src/theme/edge-insets'
import Pressable from 'Kebetoo/src/shared/components/buttons/pressable'
import { readableSeconds } from 'Kebetoo/src/shared/helpers/dates'

import styles from './styles'
import Typography, { types } from '../typography'

const Waves = () => (
  <View style={styles.wavesContainer}>
    <Image style={styles.waves} source={images.waves} />
  </View>
)

export const PlayButton = ({ onPress, state, ...otherProps }) => (
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

export const DeleteIconButton = ({ onPress }) => (
  <TouchableOpacity
    style={styles.deleteWrapper}
    onPress={onPress}
    hitSlop={edgeInsets.all(50)}
  >
    <Ionicon name="ios-close" size={20} color={colors.textPrimary} />
  </TouchableOpacity>
)

// TODO: cleanup on component unmount
export const AudioPlayer = ({
  duration, source, onDelete, style, round, onPress, player: instance,
}) => {
  const [player, setPlayer] = useState(instance)
  const [playerState, setPlayerState] = useState(MediaStates.IDLE)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef(null)

  const onEnd = useCallback((ended) => {
    if (ended) {
      setPlayerState(MediaStates.IDLE)
      clearInterval(intervalRef.current)
      intervalRef.current = null
      setProgress(0)
      setPlayer(null)
    }
  }, [])

  const handleInterval = useCallback((soundPlayer) => {
    let totalTime = soundPlayer.getDuration()
    if (totalTime < 0) {
      totalTime = parseInt(duration, 10)
    }
    if (!intervalRef.current) {
      const intervalId = setInterval(() => {
        soundPlayer.getCurrentTime((currentTime) => {
          const currentProgress = (currentTime / totalTime) * 100
          setProgress(currentProgress < 100 ? currentProgress : 0)
        })
      }, 1)
      intervalRef.current = intervalId
    }
    return () => {
      clearInterval(intervalRef.current)
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

  return (
    <Pressable
      onPress={onPressDelegate}
      style={[styles.audioWrapper, style, round && styles.round]}
      testID="player-wrapper"
    >
      {onDelete && <DeleteIconButton onPress={onDelete} />}
      <View testID="progress" style={[styles.progress, round && styles.round, { width: `${progress}%` }]} />
      <PlayButton state={playerState} onPress={onPlayPause} />
      <Waves />
      <Typography type={types.headline6} text={readableSeconds(duration)} style={styles.duration} />
    </Pressable>
  )
}

export default React.memo(AudioPlayer)
