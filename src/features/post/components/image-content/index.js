import { memo } from 'react'
import { View, TouchableOpacity, ImageBackground } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { Pressable, Typography, FormatedTypography } from '@app/shared/components'
import { edgeInsets } from '@app/theme'
import { env } from '@app/config'
import { useAppColors, useAppStyles } from '@app/shared/hooks'

import createThemeColors from './styles'

export const getSource = (url) => ({ uri: url.startsWith('http') ? url : `${env.assetsBaseUrl}/${url.startsWith('/') ? url.substr(1) : url}` })

export const DeleteIconButton = ({ onPress }) => {
  const styles = useAppStyles(createThemeColors)
  const { colors } = useAppColors()
  return (
    <TouchableOpacity
      style={styles.deleteWrapper}
      onPress={onPress}
      hitSlop={edgeInsets.all(20)}
    >
      <Ionicon name="ios-close" size={25} color={colors.textPrimary} />
    </TouchableOpacity>
  )
}

export const ImageViewer = ({
  source, style, onDelete, onPress, borderRadius = 0, ...otherProps
}) => {
  const styles = useAppStyles(createThemeColors)
  return (
    <>
      <View style={[styles.imageWrapper, style, { borderRadius }]} {...otherProps}>
        <ImageBackground source={source} style={styles.flex} borderRadius={borderRadius}>
          {onPress && <Pressable style={styles.flex} onPress={onPress} />}
        </ImageBackground>
      </View>
      {onDelete && <DeleteIconButton onPress={onDelete} />}
    </>
  )
}

const ImageContent = ({
  content, url, style, mode, onPress,
}) => {
  const styles = useAppStyles(createThemeColors)
  return (
    <View style={[styles.wrapper, style, mode === 'comments' && styles.commentMode]}>
      <View style={styles.text}>
        <FormatedTypography
          type={Typography.types.body}
          text={content.trim()}
          numberOfLines={2}
        />
      </View>
      <ImageViewer
        onPress={onPress}
        style={styles.imageViewer}
        source={getSource(url)}
        testID="image-viewer"
      />
    </View>
  )
}

export default memo(ImageContent)
