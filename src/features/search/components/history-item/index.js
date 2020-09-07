import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import Typography, { types } from 'Kebetoo/src/shared/components/typography'
import edgeInsets from 'Kebetoo/src/theme/edge-insets'
import colors from 'Kebetoo/src/theme/colors'
import Pressable from 'Kebetoo/src/shared/components/buttons/pressable'

import styles from './styles'

export const DeleteIconButton = ({ onPress }) => (
  <TouchableOpacity
    style={styles.deleteWrapper}
    onPress={onPress}
    hitSlop={edgeInsets.all(50)}
  >
    <Ionicon name="ios-close" size={25} color={colors.textPrimary} />
  </TouchableOpacity>
)

const HistoryItem = ({ item, onPress, onDelete }) => (
  <Pressable onPress={() => onPress(item)} testID="history-item" style={styles.searchHistoryButton}>
    <View style={styles.historyItem}>
      <Typography text={item} type={types.headline4} />
      <DeleteIconButton onPress={() => onDelete(item)} />
    </View>
  </Pressable>
)

export default HistoryItem
