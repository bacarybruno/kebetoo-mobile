import React from 'react'
import { Image, View } from 'react-native'

import styles from './styles'

export default ({ src }) => (
  <View style={styles.wrapper}>
    <Image style={styles.image} source={{ uri: src }} />
  </View>
)
