import React from 'react'
import { View, Image } from 'react-native'

import { Typography } from '@app/shared/components'

import styles from './styles'

const OnboardingSlide = ({ imageSrc, slideTitle, slideDescription }) => (
  <View style={styles.wrapper}>
    <Image style={styles.image} source={imageSrc} />
    <Typography
      type={Typography.types.headline1}
      text={slideTitle}
      style={styles.title}
      bold
    />
    <Typography
      type={Typography.types.subheading}
      text={slideDescription}
      style={styles.description}
    />
  </View>
)

export default OnboardingSlide
