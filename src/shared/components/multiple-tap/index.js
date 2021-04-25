import { useCallback, useRef } from 'react'
import { TapGestureHandler, State, LongPressGestureHandler } from 'react-native-gesture-handler'

const MultipleTapHandler = ({ onPress, onDoublePress, onLongPress, children }) => {
  const doubleTapRef = useRef()

  const onSingleTap = useCallback((event) => {
    if (event.nativeEvent.state === State.ACTIVE && onPress) {
      onPress()
    }
  }, [onPress])

  const onDoubleTap = useCallback((event) => {
    if (event.nativeEvent.state === State.ACTIVE && onDoublePress) {
      onDoublePress()
    }
  }, [onDoublePress])

  const onLongTap = useCallback((event) => {
    if (event.nativeEvent.state === State.ACTIVE && onLongPress) {
      onLongPress()
    }
  }, [onLongPress])

  return (
    <LongPressGestureHandler onHandlerStateChange={onLongTap}>
      <TapGestureHandler maxDelayMs={100} onHandlerStateChange={onSingleTap} waitFor={doubleTapRef}>
        <TapGestureHandler maxDelayMs={100} ref={doubleTapRef} onHandlerStateChange={onDoubleTap} numberOfTaps={2}>
          {children}
        </TapGestureHandler>
      </TapGestureHandler>
    </LongPressGestureHandler>
  )
}

export default MultipleTapHandler
