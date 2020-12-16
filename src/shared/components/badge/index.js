import React from 'react'
import { View } from 'react-native'

import { useAppColors } from '@app/shared/hooks'

import styles from './styles'
import Typography, { types, weights } from '../typography'

const getBackgroundColor = (primary, colors) => ({
  backgroundColor: primary ? colors.primary : colors.secondary,
})

const Badge = ({
  text, style, primary, typography,
}) => {
  const colors = useAppColors()
  return (
    <View style={[styles.wrapper, getBackgroundColor(primary, colors), style]}>
      <Typography
        type={typography || types.headline5}
        text={text}
        color={primary ? 'white' : 'primary'}
        systemWeight={weights.bold}
      />
    </View>
  )
}

export default React.memo(Badge)
