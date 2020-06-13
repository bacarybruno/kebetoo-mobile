import React, { useState, useCallback, useRef } from 'react'
import {
  View, TouchableOpacity, Image, ActivityIndicator,
} from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { MediaStates } from '@react-native-community/audio-toolkit'
import Player from 'react-native-sound'

import colors from 'Kebetoo/src/theme/colors'
import images from 'Kebetoo/src/theme/images'
import { ThemedText } from 'Kebetoo/src/shared/components/text'
import Pressable from 'Kebetoo/src/shared/components/buttons/pressable'
import { BASE_URL } from 'Kebetoo/src/shared/helpers/http'
import edgeInsets from 'Kebetoo/src/theme/edge-insets'

import styles from './styles'
import { extractMetadataFromName } from '../../hooks/audio-recorder'

export const getSource = (url) => `${BASE_URL}${url}`

const Waves = () => (
  <View style={styles.wavesContainer}>
    <Image style={styles.waves} source={images.waves} />
  </View>
)

const PlayButton = ({ onPress, state }) => (
  <TouchableOpacity style={styles.iconWrapper} onPress={onPress}>
    {state === MediaStates.PREPARING
      ? (
        <ActivityIndicator color={colors.blue_dark} />
      ) : (
        <Ionicon
          name={state === MediaStates.PLAYING ? 'ios-pause' : 'ios-play'}
          size={20}
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
    <Ionicon name="ios-close" size={20} />
  </TouchableOpacity>
)

// FIXME: app crash on some huawei devices. use react-native-sound
export const AudioPlayer = ({
  name, source, onDelete, style, round, onPress,
}) => {
  const [player, setPlayer] = useState(null)
  const [playerState, setPlayerState] = useState(MediaStates.IDLE)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef(null)

  const onEnd = useCallback((ended) => {
    if (ended) {
      setPlayerState(MediaStates.IDLE)
      clearInterval(intervalRef.current)
      setProgress(0)
      setPlayer(null)
    }
  }, [])

  const handleInterval = useCallback((soundPlayer) => {
    let totalTime = soundPlayer.getDuration()
    console.log(totalTime)
    if (totalTime < 0) {
      const { duration } = extractMetadataFromName(name)
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
  }, [])

  const onPlayPause = useCallback(async () => {
    let playerInstance = null
    if (!player || (player && !player.isLoaded())) {
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
    >
      {onDelete && <DeleteIconButton onPress={onDelete} />}
      <View style={[styles.progress, round && styles.round, { width: `${progress}%` }]} />
      <PlayButton state={playerState} onPress={onPlayPause} />
      <Waves />
    </Pressable>
  )
}
const AudioContent = ({ post, style, onPress }) => (
  <View style={[styles.wrapper, style]}>
    <ThemedText style={styles.text} text={post.content} />
    <AudioPlayer onPress={onPress} source={getSource(post.audio.url)} name={post.audio.name} />
  </View>
)

export default React.memo(AudioContent)
