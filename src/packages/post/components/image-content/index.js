import React from 'react'
import { View, TouchableOpacity, ImageBackground } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { ThemedText } from 'Kebetoo/src/shared/components/text'
import Pressable from 'Kebetoo/src/shared/components/buttons/pressable'
import edgeInsets from 'Kebetoo/src/theme/edge-insets'
import { BASE_URL } from 'Kebetoo/src/shared/helpers/http'

import styles from './styles'

export const getSource = (url) => ({ uri: `${BASE_URL}${url}` })

export const DeleteIconButton = ({ onPress }) => (
  <TouchableOpacity
    style={styles.deleteWrapper}
    onPress={onPress}
    hitSlop={edgeInsets.all(50)}
  >
    <Ionicon name="ios-close" size={25} />
  </TouchableOpacity>
)

export const ImageViewer = ({
  source, style, onDelete, onPress, borderRadius = 0, ...otherProps
}) => (
  <>
    <View style={[styles.imageWrapper, style]} {...otherProps}>
      <ImageBackground source={source} style={{ ...styles.flex, borderRadius }}>
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
    <ThemedText
      numberOfLines={mode === 'comments' ? 1 : undefined}
      style={styles.text}
      text={content}
    />
    <ImageViewer
      onPress={onPress}
      style={styles.imageViewer}
      source={getSource(url)}
      testID="image-viewer"
    />
  </View>
)

export default React.memo(ImageContent)
