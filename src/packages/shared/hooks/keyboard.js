import { useState, useEffect } from 'react'
import { Keyboard } from 'react-native'

export default () => {
  const [keyboardShown, setKeyboardShown] = useState(false)

  const keyboardDidShow = () => {
    setKeyboardShown(true)
  }

  const keyboardDidHide = () => {
    setKeyboardShown(false)
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardDidShow)
    Keyboard.addListener('keyboardDidHide', keyboardDidHide)
    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardDidShow)
      Keyboard.removeListener('keyboardDidHide', keyboardDidHide)
    }
  }, [])

  return keyboardShown
}
