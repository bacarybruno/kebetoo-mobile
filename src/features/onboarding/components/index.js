import React from 'react'
import { View } from 'react-native'

import { FormatedTypography, Typography } from '@app/shared/components'
import { metrics } from '@app/theme'

import styles from './styles'

const OnboardingSlide = ({ slideTitle, slideDescription }) => {
  const showTitle = metrics.screenHeight > 568
  return (
    <View style={styles.wrapper}>
      {showTitle && (
        <Typography
          bold
          text={slideTitle}
          type={Typography.types.headline1}
          color="black"
          numberOfLines={2}
          adjustsFontSizeToFit
        />
      )}
      <View style={styles.description}>
        <FormatedTypography
          text={slideDescription}
          type={Typography.types.subheading}
          color="black"
        />
      </View>
    </View>
  )
}

export default React.memo(OnboardingSlide)
