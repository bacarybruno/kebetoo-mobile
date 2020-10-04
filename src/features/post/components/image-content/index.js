import React from 'react'
import { View, TouchableOpacity, ImageBackground } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { Pressable, Typography } from '@app/shared/components'
import { colors, edgeInsets } from '@app/theme'
import { env } from '@app/config'

import styles from './styles'

export const getSource = (url) => ({ uri: url.startsWith('http') ? url : `${env.assetsBaseUrl}/${url.startsWith('/') ? url.substr(1) : url}` })

export const DeleteIconButton = ({ onPress }) => (
  <TouchableOpacity
    style={styles.deleteWrapper}
    onPress={onPress}
    hitSlop={edgeInsets.all(50)}
  >
    <Ionicon name="ios-close" size={25} color={colors.textPrimary} />
  </TouchableOpacity>
)

export const ImageViewer = ({
  source, style, onDelete, onPress, borderRadius = 0, ...otherProps
}) => (
  <>
    <View style={[styles.imageWrapper, style]} {...otherProps}>
      <ImageBackground source={source} style={styles.flex} borderRadius={borderRadius}>
        {onPress && <Pressable style={styles.flex} onPress={onPress} />}
      </ImageBackground>
    </View>
    {onDelete && <DeleteIconButton onPress={onDelete} />}
  </>
)

const ImageContent = ({
  content, url, style, mode, onPress,
}) => (
  <View style={[styles.wrapper, style, mode === 'comments' && styles.commentMode]}>
    <Typography type={Typography.types.body} text={content} style={styles.text} numberOfLines={mode === 'comments' ? 1 : undefined} />
    <ImageViewer
      onPress={onPress}
      style={styles.imageViewer}
      source={getSource(url)}
      testID="image-viewer"
    />
  </View>
)

export default React.memo(ImageContent)
