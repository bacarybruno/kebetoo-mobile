import React from 'react'
import { Image, View } from 'react-native'

import Text from 'Kebetoo/src/shared/components/text'

import generateColor from 'Kebetoo/src/shared/helpers/color-generator'
import styles from './styles'

const borderRadius = (size) => size && { borderRadius: size / 2 }
const dimensions = (size) => size && { width: size, height: size }
const backgroundColor = (text) => text && { backgroundColor: generateColor(text) }

export const ImageAvatar = ({ src, size }) => (
  <View style={[styles.wrapper, dimensions(size)]}>
    <Image
      testID={`image-avatar-${src}`}
      style={[styles.content, borderRadius(size)]}
      source={{ uri: src }}
    />
  </View>
)

export const TextAvatar = ({ text, size, fontSize }) => (
  <View style={[styles.wrapper, dimensions(size)]}>
    <View style={[styles.content, borderRadius(size), backgroundColor(text)]}>
      <Text color="white" size="md" bold fontSize={fontSize}>{text[0].toUpperCase()}</Text>
    </View>
  </View>
)

const Avatar = ({ src, text, ...props }) => (
  src ? <ImageAvatar src={src} {...props} /> : <TextAvatar text={text} {...props} />
)

export default React.memo(Avatar)
