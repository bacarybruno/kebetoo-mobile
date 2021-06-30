import { useState, useEffect } from 'react'
import { Keyboard, Platform } from 'react-native'

const useKeyboard = () => {
  const [keyboardShown, setKeyboardShown] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  const keyboardShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
  const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

  useEffect(() => {
    const keyboardDidShow = (e) => {
      setKeyboardShown(true)
      setKeyboardHeight(e.endCoordinates.height)
    }

    const keyboardDidHide = () => {
      setKeyboardShown(false)
      setKeyboardHeight(0)
    }

    const showEvent = Keyboard.addListener(keyboardShowEvent, keyboardDidShow)
    const hideEvent = Keyboard.addListener(keyboardHideEvent, keyboardDidHide)

    return () => {
      showEvent.remove()
      hideEvent.remove()
    }
  }, [keyboardHideEvent, keyboardShowEvent])

  return { keyboardShown, keyboardHeight }
}

export default useKeyboard
