import { metrics } from '@app/theme'
import React, { useCallback, useRef, useState } from 'react'
import { Animated, Dimensions } from 'react-native'
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler'

const directions = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
}

const PinchableImage = ({
  source,
  style,
  enableScale = true,
  enableMove = true,
  shouldResetScale = false,
}) => {
  const scale = useRef(new Animated.Value(1))
  const translateX = useRef(new Animated.Value(0))
  const translateY = useRef(new Animated.Value(0))
  
  const imageRef = useRef()

  const [translationOffset, setTranslationOffset] = useState({ x: 0, y: 0 })
  const [scaleOffset, setScaleOffset] = useState(0)

  const onZoomEvent = useCallback((event) => {
    let zoom
    if (event.nativeEvent.scale < 1) {
      //　decreasing
      zoom = event.nativeEvent.scale + (scaleOffset * event.nativeEvent.scale)
      zoom = Math.max(zoom, 1)
      
      // TODO: interpolate values
      translateX.current.setValue(0)
      translateY.current.setValue(0)
      setTranslationOffset({ x: 0, y: 0 })
    } else {
      // increasing
      zoom = event.nativeEvent.scale + scaleOffset
    }
    scale.current.setValue(zoom)
  }, [scaleOffset])

  const onZoomStateChange = useCallback((event) => {
    if (event.nativeEvent.oldState === State.ACTIVE && shouldResetScale) {
      Animated.spring(scale.current, {
        toValue: 1,
        useNativeDriver: false,
      }).start()
      setTimeout(() => {
        setScaleOffset(0)
        scale.current.setValue(1)
      }, 1000)
    }
    if (event.nativeEvent.state === State.END) {
      setScaleOffset(scale.current._value - 1)
    }
  }, [shouldResetScale])

  const onMoveStateChange = useCallback((event) => {
    if (event.nativeEvent.state === State.END) {
      setTranslationOffset({
        x: translateX.current._value,
        y: translateY.current._value,
      })
    }
  }, [])

  const getMoveDirection = useCallback((translationXValue, translationYValue) => {
    if (translationXValue < translateX.current._value) {
      return directions.LEFT
    } else if (translationXValue > translateX.current._value) {
      return directions.RIGHT
    }
    if (translationYValue < translateY.current._value) {
      return directions.TOP
    } else if (translationYValue > translateY.current._value) {
      return directions.BOTTOM
    }
  }, [])

  const onMoveEvent = useCallback((event) => {
    const { translationX, translationY } = event.nativeEvent
    
    const translationXValue = translationX + translationOffset.x
    const translationYValue = translationY + translationOffset.y

    imageRef.current.measure((x, y, width, height, pageX, pageY) => {
      const canMoveHorizontally = x < 0 && (Math.round(width + x) >= metrics.screenWidth)
      const canMoveVertically = y < 0 && (Math.round(height + y) >= metrics.screenHeight)

      const direction = getMoveDirection(translationXValue, translationYValue)
      console.log(x, width + x, metrics.screenWidth)
      
      if ([directions.LEFT, directions.RIGHT].includes(direction) && !canMoveHorizontally) {
        return
      }
      if ([directions.TOP, directions.BOTTOM].includes(direction) && !canMoveVertically) {
        return
      }

      translateX.current.setValue(translationXValue)
      translateY.current.setValue(translationYValue)
    })
  }, [translationOffset, getMoveDirection])

  return (
    <PanGestureHandler
      enabled={enableMove}
      minPointers={1}
      maxPointers={1}
      onGestureEvent={onMoveEvent}
      onHandlerStateChange={onMoveStateChange}
    >
      <PinchGestureHandler
        enabled={enableScale}
        minPointers={2}
        maxPointers={2}
        onGestureEvent={onZoomEvent}
        onHandlerStateChange={onZoomStateChange}
      >
        <Animated.Image
          zU
          ref={imageRef}
          source={source}
          style={[{
            transform: [
              { scale: scale.current },
              { translateX: Animated.divide(translateX.current, scale.current) },
              { translateY: Animated.divide(translateY.current, scale.current) },
            ],
          }, style]}
        />
      </PinchGestureHandler>
    </PanGestureHandler>
  )
}

export default PinchableImage
