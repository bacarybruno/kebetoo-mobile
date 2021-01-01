import React from 'react'
import { Image, View, Text } from 'react-native'
import { systemWeights } from 'react-native-typography'

import generateColor from '@app/shared/helpers/color-generator'
import { useAppColors, useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'

const borderRadius = (size) => size && { borderRadius: size / 2 }
const dimensions = (size) => size && { width: size, height: size }
const backgroundColor = (text) => text && { backgroundColor: generateColor(text) }

export const ImageAvatar = ({ src, size, style }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={[styles.wrapper, dimensions(size), style]}>
      <Image
        testID={`image-avatar-${src}`}
        style={[styles.content, borderRadius(size)]}
        source={{ uri: src }}
      />
    </View>
  )
}

export const TextAvatar = ({
  text, size, style, fontSize, noRadius,
}) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()
  return (
    <View style={[styles.wrapper, dimensions(size), style]}>
      <View style={[
        styles.content,
        borderRadius(size),
        noRadius && { borderRadius: 0 },
        backgroundColor(text)]}
      >
        <Text
          style={{ fontSize, ...systemWeights.semibold, color: colors.white }}
        >
          {text ? text[0].toUpperCase() : ''}
        </Text>
      </View>
    </View>
  )
}

const Avatar = ({ src, text, ...props }) => (
  src ? <ImageAvatar src={src} {...props} /> : <TextAvatar text={text} {...props} />
)

export default React.memo(Avatar)
