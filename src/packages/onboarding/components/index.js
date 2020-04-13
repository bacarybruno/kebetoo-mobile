import React from 'react'
import { View, Image, Text } from 'react-native'

import styles from './styles'

export default ({ imageSrc, slideTitle, slideDescription }) => (
  <View style={styles.wrapper}>
    <Image style={styles.image} source={imageSrc} />
    <Text adjustsFontSizeToFit style={styles.title}>{slideTitle}</Text>
    <Text style={styles.description}>{slideDescription}</Text>
  </View>
)
