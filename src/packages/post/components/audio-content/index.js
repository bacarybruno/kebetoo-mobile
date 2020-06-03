import React, {
  useState, useCallback, useEffect, useRef,
} from 'react'
import {
  View, TouchableOpacity, Image, ActivityIndicator,
} from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { Player, MediaStates } from '@react-native-community/audio-toolkit'

import colors from 'Kebetoo/src/theme/colors'
import images from 'Kebetoo/src/theme/images'
import { ThemedText } from 'Kebetoo/src/shared/components/text'
import Pressable from 'Kebetoo/src/shared/components/buttons/pressable'
import { BASE_URL } from 'Kebetoo/src/shared/helpers/http'
import edgeInsets from 'Kebetoo/src/theme/edge-insets'

import styles from './styles'

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

export const AudioPlayer = ({
  source, onDelete, style, round, onPress,
}) => {
  const [player] = useState(
    new Player(source, {
      autoDestroy: false,
    }),
  )
  const [playerState, setPlayerState] = useState(null)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef()

  const updatePlayerState = useCallback(() => {
    setPlayerState(player.state)
  }, [player])

  useEffect(() => {
    updatePlayerState()
    return () => {
      clearInterval(intervalRef.current)
      player.destroy()
    }
  }, [player, updatePlayerState])

  useEffect(() => {
    player.on('ended', () => {
      updatePlayerState()
      setProgress(0)
      clearInterval(intervalRef.current)
      intervalRef.current = null
    })
  }, [player, updatePlayerState])

  const onPlayPause = useCallback(() => {
    if (!player.isPrepared) {
      setPlayerState(MediaStates.PREPARING)
    }
    player.playPause((err, paused) => {
      updatePlayerState()
      if (!intervalRef.current && !paused) {
        let lastTime = 0
        intervalRef.current = setInterval(() => {
          const currentTime = Math.max(player.currentTime, lastTime)
          const totalTime = Math.max(player.duration, 0)
          const currentProgress = (currentTime / totalTime) * 100
          lastTime = currentTime
          setProgress(currentProgress)
        }, 1)
      }
    })
  }, [player, updatePlayerState])

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
    <AudioPlayer onPress={onPress} source={getSource(post.audio.url)} />
  </View>
)

export default AudioContent