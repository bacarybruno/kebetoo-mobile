import { useState, useEffect } from 'react'
import { Keyboard } from 'react-native'

export default () => {
  const [keyboardShown, setKeyboardShown] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  const keyboardDidShow = (e) => {
    setKeyboardShown(true)
    setKeyboardHeight(e.endCoordinates.height)
  }

  const keyboardDidHide = () => {
    setKeyboardShown(false)
    setKeyboardHeight(0)
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardDidShow)
    Keyboard.addListener('keyboardDidHide', keyboardDidHide)
    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardDidShow)
      Keyboard.removeListener('keyboardDidHide', keyboardDidHide)
    }
  }, [])

  return { keyboardShown, keyboardHeight }
}
