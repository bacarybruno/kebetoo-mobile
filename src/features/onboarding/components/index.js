import React from 'react'
import { View } from 'react-native'

import { Typography } from '@app/shared/components'

import styles from './styles'

const OnboardingSlide = ({ slideTitle, slideDescription }) => (
  <View style={styles.wrapper}>
    <Typography
      type={Typography.types.headline1}
      text={slideTitle}
      bold
    />
    <Typography
      type={Typography.types.subheading}
      text={slideDescription}
      style={styles.description}
    />
  </View>
)

export default React.memo(OnboardingSlide)
