import React from 'react'
import { Keyboard, Platform } from 'react-native'
import { render, act } from 'react-native-testing-library'

import useKeyboard from '../keyboard'

/**
 * Keyboard events hook
 */
const createKeyboardEvent = (...props) => {
  const returnVal = {}
  const TestComponent = () => {
    Object.assign(returnVal, useKeyboard(...props))
    return null
  }
  render(<TestComponent />)
  return returnVal
}

it('is defined', () => {
  const keyboard = createKeyboardEvent()
  // props
  expect(keyboard.keyboardShown).toBeDefined()
  expect(keyboard.keyboardHeight).toBeDefined()
})

describe('keyboard events for android', () => {
  it('handles keyboardDidShow', () => {
    Platform.OS = 'android'
    const keyboard = createKeyboardEvent()
    act(() => {
      Keyboard.emit('keyboardDidShow', { endCoordinates: { height: 100 } })
    })
    expect(keyboard.keyboardShown).toBe(true)
  })

  it('handles keyboardDidHide', () => {
    Platform.OS = 'android'
    const keyboard = createKeyboardEvent()
    act(() => {
      Keyboard.emit('keyboardDidHide')
    })
    expect(keyboard.keyboardShown).toBe(false)
  })
})

describe('keyboard events for ios', () => {
  it('handles keyboardWillShow', () => {
    Platform.OS = 'ios'
    const keyboard = createKeyboardEvent()
    act(() => {
      Keyboard.emit('keyboardWillShow', { endCoordinates: { height: 100 } })
    })
    expect(keyboard.keyboardShown).toBe(true)
  })

  it('handles keyboardWillHide', () => {
    Platform.OS = 'ios'
    const keyboard = createKeyboardEvent()
    act(() => {
      Keyboard.emit('keyboardWillHide')
    })
    expect(keyboard.keyboardShown).toBe(false)
  })
})
