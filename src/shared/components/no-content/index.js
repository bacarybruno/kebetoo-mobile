import React from 'react'
import { View } from 'react-native'

import Text from 'Kebetoo/src/shared/components/text'

import styles from './styles'

const NoContent = ({ title, text, children }) => (
  <View style={styles.noContent}>
    {title && <Text color="secondary" size="header" text={title} />}
    {text && <Text text={text} />}
    {children}
  </View>
)

export default React.memo(NoContent)
