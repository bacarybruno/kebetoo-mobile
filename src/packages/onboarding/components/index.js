import React from 'react'
import { View, Image } from 'react-native'

import Text from 'Kebetoo/src/shared/components/text'

import styles from './styles'

const OnboardingSlide = ({ imageSrc, slideTitle, slideDescription }) => (
  <View style={styles.wrapper}>
    <Image style={styles.image} source={imageSrc} />
    <Text
      bold
      adjustsFontSizeToFit
      size="xl"
      style={styles.title}
      text={slideTitle}
    />
    <Text style={styles.description} text={slideDescription} />
  </View>
)

export default OnboardingSlide
