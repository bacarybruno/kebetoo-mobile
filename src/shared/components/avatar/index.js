import React from 'react'
import { Image, View } from 'react-native'

import Text from 'Kebetoo/src/shared/components/text'

import generateColor from 'Kebetoo/src/shared/helpers/color-generator'
import styles from './styles'

export const ImageAvatar = ({ src }) => (
  <View style={styles.wrapper}>
    <Image style={styles.content} source={{ uri: src }} />
  </View>
)

export const TextAvatar = ({ text }) => (
  <View style={styles.wrapper}>
    <View style={[styles.content, { backgroundColor: generateColor(text) }]}>
      <Text color="white" size="md" bold>{text[0].toUpperCase()}</Text>
    </View>
  </View>
)

const Avatar = ({ src, text }) => (
  src ? <ImageAvatar src={src} /> : <TextAvatar text={text} />
)

export default Avatar
