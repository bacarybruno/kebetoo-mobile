import React from 'react'
import { Image, View, Text } from 'react-native'
import { systemWeights } from 'react-native-typography'

import generateColor from 'Kebetoo/src/shared/helpers/color-generator'
import colors from 'Kebetoo/src/theme/colors'

import styles from './styles'

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

export const TextAvatar = ({
  text, size, style, fontSize,
}) => (
  <View style={[styles.wrapper, dimensions(size), style]}>
    <View style={[styles.content, borderRadius(size), backgroundColor(text)]}>
      <Text
        style={{ fontSize, ...systemWeights.semibold, color: colors.white }}
      >
        {text[0].toUpperCase()}
      </Text>
    </View>
  </View>
)

const Avatar = ({ src, text, ...props }) => (
  src ? <ImageAvatar src={src} {...props} /> : <TextAvatar text={text} {...props} />
)

export default React.memo(Avatar)
