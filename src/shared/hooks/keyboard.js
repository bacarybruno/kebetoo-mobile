import { useState, useEffect } from 'react'
import { Keyboard, Platform } from 'react-native'

const useKeyboard = () => {
  const [keyboardShown, setKeyboardShown] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  const keybordShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
  const keybordHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

  useEffect(() => {
    const keyboardDidShow = (e) => {
      setKeyboardShown(true)
      setKeyboardHeight(e.endCoordinates.height)
    }
  
    const keyboardDidHide = () => {
      setKeyboardShown(false)
      setKeyboardHeight(0)
    }
  
    Keyboard.addListener(keybordShowEvent, keyboardDidShow)
    Keyboard.addListener(keybordHideEvent, keyboardDidHide)

    return () => {
      Keyboard.removeListener(keybordShowEvent, keyboardDidShow)
      Keyboard.removeListener(keybordHideEvent, keyboardDidHide)
    }
  }, [])

  return { keyboardShown, keyboardHeight }
}

export default useKeyboard
