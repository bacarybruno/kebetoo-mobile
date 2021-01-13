import React from 'react'
import { View } from 'react-native'

import { Typography } from '@app/shared/components'

import styles from './styles'

const OnboardingSlide = ({ slideTitle, slideDescription }) => (
  <View style={styles.wrapper}>
    <Typography
      bold
      text={slideTitle}
      type={Typography.types.headline1}
      color="black"
    />
    <Typography
      text={slideDescription}
      style={styles.description}
      type={Typography.types.subheading}
      color="black"
    />
  </View>
)

export default React.memo(OnboardingSlide)
