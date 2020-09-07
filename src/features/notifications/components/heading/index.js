import React from 'react'
import { View } from 'react-native'

import Badge from '@app/shared/components/badge'
import Typography, { types, weights } from '@app/shared/components/typography'

import styles from './styles'

const Heading = ({ name, value }) => (
  <View style={styles.header}>
    <Typography text={name} type={types.subheading} systemWeight={weights.semibold} />
    <Badge text={value} style={styles.headerBadge} />
  </View>
)

export default Heading
