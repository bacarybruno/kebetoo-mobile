import React from 'react'
import { View } from 'react-native'

import { useAppColors } from '@app/shared/hooks'

import styles from './styles'
import Typography from '../typography'

const getBackgroundColor = (primary, colors) => ({
  backgroundColor: primary ? colors.primary : colors.secondary,
})

const Badge = ({
  text, style, primary, typography, testID,
}) => {
  const { colors } = useAppColors()
  return (
    <View style={[styles.wrapper, getBackgroundColor(primary, colors), style]} testID={testID}>
      <Typography
        type={typography || Typography.types.headline5}
        text={text}
        color={primary ? 'white' : 'primary'}
        systemWeight={Typography.weights.bold}
      />
    </View>
  )
}

export default React.memo(Badge)
