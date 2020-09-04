import React from 'react'
import { View } from 'react-native'

import Badge from 'Kebetoo/src/shared/components/badge'
import Typography, { types, weights } from 'Kebetoo/src/shared/components/typography'

import styles from './styles'

const Heading = ({ name, value }) => (
  <View style={styles.header}>
    <Typography text={name} type={types.subheading} systemWeight={weights.semibold} />
    <Badge text={value} style={styles.headerBadge} />
  </View>
)

export default Heading
