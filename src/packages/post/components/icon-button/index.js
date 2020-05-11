import React, { useEffect, memo, useState } from 'react'
import { TouchableOpacity, Animated, View } from 'react-native'

import Kebeticon from 'Kebetoo/src/shared/icons/kebeticons'
import colors from 'Kebetoo/src/theme/colors'
import edgeInsets from 'Kebetoo/src/theme/edge-insets'
import metrics from 'Kebetoo/src/theme/metrics'
import Badge from 'Kebetoo/src/shared/components/badge'

import styles, { getDimensions, getIconSize } from './styles'

const scale = (value = 1) => ({ transform: [{ scale: value }] })

const IconButton = ({
  onPress,
  name,
  style,
  text = "",
  showText = false,
  size = 40,
  activable = false,
  isActive = false,
  color = colors.blue_dark,
  activeColor = colors.white,
  ...otherProps
}) => {
  const [animatedScale] = useState(new Animated.Value(1))

  useEffect(() => {
    if (activable && isActive) {
      Animated.spring(animatedScale, {
        toValue: 1.8,
        bounciness: 20,
        speed: 20,
        useNativeDriver: true
      }).start()
    } else {
      animatedScale.setValue(1)
    }
  }, [activable, isActive, animatedScale])

  return (
    <View
    style={{ flexDirection: 'row', alignItems: 'center' }}
    >
      {!!text && showText && (
        <Badge style={{ marginRight: 30 }} text={text} />
      )}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={activable ? 1 : undefined}
        hitSlop={
          isActive
            ? edgeInsets.symmetric({
              vertical: metrics.screenHeight,
              horizontal: metrics.screenWidth
            })
            : edgeInsets.all(20)
        }
        style={[
          styles.button,
          isActive && styles.activeButton,
          getDimensions(size),
          scale(animatedScale),
          style
        ]}
        {...otherProps}
      >
        <Kebeticon name={name} size={getIconSize(size)} color={isActive ? activeColor : color} />
      </TouchableOpacity>
    </View>
  )
}

export default memo(IconButton)
