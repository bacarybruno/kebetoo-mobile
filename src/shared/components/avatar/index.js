import { memo } from 'react'
import { Image, View, Text } from 'react-native'
import { systemWeights } from 'react-native-typography'

import generateColor from '@app/shared/helpers/color-generator'
import { useAppColors, useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'
import Typography from '../typography'

const dimensions = (size) => size && { width: size, height: size }
const backgroundColor = (text) => text && { backgroundColor: generateColor(text) }

export const ImageAvatar = ({
  src, size, style, children,
}) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={[styles.wrapper, dimensions(size), style]}>
      <Image
        testID={`image-avatar-${src}`}
        style={styles.content}
        source={{ uri: src }}
      />
      {children}
    </View>
  )
}

export const TextAvatar = ({
  text, size, style, fontSize, noRadius, color, children,
}) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()
  return (
    <View style={[styles.wrapper, dimensions(size), style]}>
      <View style={[
        styles.content,
        noRadius && { borderRadius: 0 },
        color ? { backgroundColor: color } : backgroundColor(text)
      ]}
      >
        <Text
          style={{ fontSize, ...systemWeights.semibold, color: colors.white }}
        >
          {text ? text[0].toUpperCase() : ''}
        </Text>
        {children}
      </View>
    </View>
  )
}

const Avatar = ({ src, text, size, badge, ...props }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <>
      {src
        ? <ImageAvatar size={size} src={src} {...props} />
        : <TextAvatar size={size} text={text} {...props} />}
      {!!badge && (
        <View style={styles.badgeWrapper}>
          <View style={styles.badge}>
            <Typography
              text={badge}
              type={Typography.types.headline6}
              systemWeight={Typography.weights.bold}
              color={Typography.colors.primary}
            />
          </View>
        </View>
      )}
    </>
  )
}

export default memo(Avatar)
