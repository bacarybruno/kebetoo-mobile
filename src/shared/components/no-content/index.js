import React from 'react'
import { View } from 'react-native'

import Typography, { types } from '../typography'

import styles from './styles'

const NoContent = ({ title, text, children }) => (
  <View style={styles.noContent}>
    {title && <Typography text={title} type={types.headline3} color="primary" />}
    {text && <Typography text={text} type={types.headline4} />}
    {children}
  </View>
)

export default React.memo(NoContent)
