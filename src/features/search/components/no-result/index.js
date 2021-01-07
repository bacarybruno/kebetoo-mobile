/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import { View, Text } from 'react-native'

import { Typography } from '@app/shared/components'
import { strings } from '@app/config'
import { useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'

const NoResult = ({ query }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>🔎</Text>
      <Typography
        type={Typography.types.headline4}
        style={styles.message}
        text={strings.formatString(strings.search.no_result, query)}
      />
    </View>
  )
}

export default NoResult
