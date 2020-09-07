/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import { View, Text } from 'react-native'

import Typography, { types } from '@app/shared/components/typography'
import strings from '@app/config/strings'

import styles from './styles'

const NoResult = ({ query }) => (
  <View style={styles.wrapper}>
    <Text style={styles.title}>🙄</Text>
    <Typography
      type={types.headline4}
      style={styles.message}
      text={strings.formatString(strings.search.no_result, query)}
    />
  </View>
)

export default NoResult
