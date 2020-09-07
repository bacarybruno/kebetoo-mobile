import React from 'react'
import { View, Image } from 'react-native'

import Typography, { types } from '@app/shared/components/typography'

import styles from './styles'

const OnboardingSlide = ({ imageSrc, slideTitle, slideDescription }) => (
  <View style={styles.wrapper}>
    <Image style={styles.image} source={imageSrc} />
    <Typography type={types.headline1} text={slideTitle} style={styles.title} bold />
    <Typography type={types.subheading} text={slideDescription} style={styles.description} />
  </View>
)

export default OnboardingSlide
