import React from 'react'
import { Image, View } from 'react-native'

import generateColor from 'Kebetoo/src/shared/helpers/color-generator'

import styles from './styles'
import Typography, { types } from '../typography'

const borderRadius = (size) => size && { borderRadius: size / 2 }
const dimensions = (size) => size && { width: size, height: size }
const backgroundColor = (text) => text && { backgroundColor: generateColor(text) }

export const ImageAvatar = ({ src, size, style }) => (
  <View style={[styles.wrapper, dimensions(size), style]}>
    <Image
      testID={`image-avatar-${src}`}
      style={[styles.content, borderRadius(size)]}
      source={{ uri: src }}
    />
  </View>
)

export const TextAvatar = ({ text, size, style }) => (
  <View style={[styles.wrapper, dimensions(size), style]}>
    <View style={[styles.content, borderRadius(size), backgroundColor(text)]}>
      <Typography type={types.headline4} text={text[0].toUpperCase()} bold color="white" />
    </View>
  </View>
)

const Avatar = ({ src, text, ...props }) => (
  src ? <ImageAvatar src={src} {...props} /> : <TextAvatar text={text} {...props} />
)

export default React.memo(Avatar)
