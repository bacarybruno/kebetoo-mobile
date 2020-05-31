import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { ThemedText } from 'Kebetoo/src/shared/components/text'
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
  source, style, onDelete, borderRadius = 0,
}) => (
  <>
    <View style={[styles.imageWrapper, style]}>
      <Image source={source} style={{ ...styles.image, borderRadius }} />
    </View>
    {onDelete && <DeleteIconButton onPress={onDelete} />}
  </>
)

const ImageContent = ({ post, style, mode }) => (
  <View style={[styles.wrapper, style, mode === 'comments' && styles.commentMode]}>
    <ThemedText numberOfLines={mode === 'comments' ? 2 : undefined} style={styles.text} text={post.content} />
    <ImageViewer style={styles.imageViewer} source={getSource(post.image.url)} />
  </View>
)

export default ImageContent
