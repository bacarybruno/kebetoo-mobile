import React from 'react'
import { View } from 'react-native'

import styles from './styles'

const DraggableIndicator = () => (
  <View style={styles.draggableContainer}>
    <View style={styles.draggableIcon} />
  </View>
)

export default React.memo(DraggableIndicator)
