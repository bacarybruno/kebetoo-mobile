import { useCallback, useRef } from 'react'
import { TapGestureHandler, State } from 'react-native-gesture-handler'

const DoubleTapHandler = ({ onPress, onDoublePress, children }) => {
  const doubleTapRef = useRef()

  const onSingleTab = useCallback((event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      onPress()
    }
  }, [onPress])

  const onDoubleTap = useCallback((event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      onDoublePress()
    }
  }, [onDoublePress])

  return (
    <TapGestureHandler onHandlerStateChange={onSingleTab} waitFor={doubleTapRef}>
      <TapGestureHandler ref={doubleTapRef} onHandlerStateChange={onDoubleTap} numberOfTaps={2}>
        {children}
      </TapGestureHandler>
    </TapGestureHandler>
  )
}

export default DoubleTapHandler
