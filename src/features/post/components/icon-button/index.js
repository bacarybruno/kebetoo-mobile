import React, { useEffect, useState } from 'react'
import { TouchableOpacity, Animated, View } from 'react-native'

import Kebeticon from '@app/shared/icons/kebeticons'
import { edgeInsets, metrics } from '@app/theme'
import { Badge } from '@app/shared/components'
import { useAppColors, useAppStyles } from '@app/shared/hooks'

import createThemedStyles, { getDimensions, getIconSize } from './styles'

const scale = (value = 1) => ({ transform: [{ scale: value }] })

const IconButton = ({
  onPress,
  name,
  style,
  text = '',
  size = 40,
  activable = false,
  isActive = false,
  color,
  activeColor,
  defaultBgColor,
  defaultHitSlop = 20,
  ...otherProps
}) => {
  const [animatedScale] = useState(new Animated.Value(1))
  const styles = useAppStyles(createThemedStyles)
  const colors = useAppColors()

  useEffect(() => {
    if (activable && isActive) {
      Animated.spring(animatedScale, {
        toValue: 1.8,
        bounciness: 20,
        speed: 20,
        useNativeDriver: true,
      }).start()
    } else {
      animatedScale.setValue(1)
    }
  }, [activable, isActive, animatedScale])

  return (
    <View style={styles.wrapper}>
      {!!text && isActive && (
        <Badge style={styles.badge} text={text} />
      )}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={activable ? 1 : undefined}
        hitSlop={
          isActive
            ? edgeInsets.symmetric({
              vertical: metrics.screenHeight,
              horizontal: metrics.screenWidth,
            })
            : edgeInsets.all(defaultHitSlop)
        }
        style={[
          styles.button,
          { backgroundColor: defaultBgColor || colors.backgroundSecondary },
          isActive && styles.activeButton,
          getDimensions(size),
          scale(animatedScale),
          style,
        ]}
        {...otherProps}
      >
        <Kebeticon
          name={name}
          size={getIconSize(size)}
          color={isActive ? (activeColor || colors.white) : (color || colors.blue_dark)}
        />
      </TouchableOpacity>
    </View>
  )
}

export default React.memo(IconButton)
