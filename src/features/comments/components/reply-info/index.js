import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { Typography } from '@app/shared/components'
import { colors } from '@app/theme'
import { strings } from '@app/config'
import { generateColor } from '@app/shared/helpers'
import { useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'

export const DeleteIconButton = ({ onPress }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <TouchableOpacity style={styles.deleteWrapper} onPress={onPress}>
      <Ionicon name="ios-close" size={20} color={colors.textPrimary} />
    </TouchableOpacity>
  )
}

const ReplyInfo = ({ info, size, onClose }) => {
  const { content, author } = info
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={{ ...styles.replyInfoWrapper, height: size }}>
      <View style={[styles.replyInfoContainer, { borderColor: generateColor(author.displayName) }]}>
        <View style={styles.replyInfoContent}>
          <Typography
            style={styles.caption}
            color={Typography.colors.secondary}
            text={strings.formatString(strings.comments.replying_to, author.displayName)}
            type={Typography.types.caption}
          />
          <Typography
            type={Typography.types.headline5}
            numberOfLines={1}
            color={Typography.colors.primary}
            text={content || strings.general.audio}
          />
        </View>
        <DeleteIconButton onPress={onClose} />
      </View>
    </View>
  )
}

export default ReplyInfo
