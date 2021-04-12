import { View, TouchableOpacity } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { edgeInsets } from '@app/theme'
import { useAppColors, useAppStyles } from '@app/shared/hooks'
import { Pressable, Typography } from '@app/shared/components'

import createThemedStyles from './styles'

export const DeleteIconButton = ({ onPress }) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()
  return (
    <TouchableOpacity
      style={styles.deleteWrapper}
      onPress={onPress}
      hitSlop={edgeInsets.all(50)}
    >
      <Ionicon name="ios-close" size={20} color={colors.textPrimary} />
    </TouchableOpacity>
  )
}

const HistoryItem = ({ item, onPress, onDelete }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <Pressable onPress={() => onPress(item)} testID="history-item" style={styles.searchHistoryButton}>
      <View style={styles.historyItem}>
        <Typography text={item} type={Typography.types.headline4} />
        <DeleteIconButton onPress={() => onDelete(item)} />
      </View>
    </Pressable>
  )
}

export default HistoryItem
