import React from 'react'
import { View } from 'react-native'

import { Typography } from '@app/shared/components'
import { useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'

const HrLine = ({ text, style }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.line} />
      {text && <Typography type={Typography.types.separator} text={text} style={styles.text} />}
      <View style={styles.line} />
    </View>
  )
}

export default HrLine
