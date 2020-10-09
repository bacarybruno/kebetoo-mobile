import React, { useRef } from 'react'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { Animated, View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { colors } from '@app/theme'

import styles, { swipeableMargin, swipeableThresold } from './styles'

const swipeableOptions = { restSpeedThreshold: 100, restDisplacementThreshold: 40, speed: 48 }

const SwipeableComment = ({ children, style, onFulfilled }) => {
  const swipeableRef = useRef()

  const mapRef = (ref) => {
    swipeableRef.current = ref
  }

  const close = () => {
    swipeableRef.current.close()
    onFulfilled()
  }

  const renderLeftActions = (_, progress) => {
    const translateX = progress.interpolate({
      inputRange: [0, swipeableMargin, swipeableThresold],
      outputRange: [-swipeableMargin, 0, 0],
    })
    return (
      <View style={styles.leftAction}>
        <Animated.View style={{ ...styles.leftContent, transform: [{ translateX }] }}>
          <Ionicon name="ios-undo" size={20} color={colors.textPrimary} />
        </Animated.View>
      </View>
    )
  }

  return (
    <Swipeable
      containerStyle={style}
      ref={mapRef}
      renderLeftActions={renderLeftActions}
      overshootLeft={false}
      overshootFriction={8}
      leftThreshold={swipeableThresold}
      animationOptions={swipeableOptions}
      onSwipeableLeftOpen={close}
    >
      {children}
    </Swipeable>
  )
}

export default SwipeableComment