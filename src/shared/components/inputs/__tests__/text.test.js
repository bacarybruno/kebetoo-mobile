import React from 'react'
import { TextInput as RNTextInput } from 'react-native'
import { fireEvent } from 'react-native-testing-library'

import setupTest from '@app/config/jest-setup'
import { keyboardName } from '@app/shared/components/emoji-selector'

import TextInput, { PopoverTooltip, EmojiPickerToggler, EmojiKeyboard } from '../text'
import { act } from 'react-test-renderer'

jest.mock('react-native-ui-lib/keyboard', () => ({
  ...jest.requireActual('react-native-ui-lib/keyboard'),
  KeyboardUtils: {
    dismiss: jest.fn(),
  },
}))

const givenTextInput = setupTest(TextInput)({
  onValueChange: jest.fn(),
  onBlur: jest.fn(),
  fieldName: 'fullname',
})

it('renders TextInput', () => {
  const { wrapper } = givenTextInput()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

describe('popover tooltip', () => {
  it('shows popover tooltip on error', () => {
    const { wrapper } = givenTextInput({ error: 'An error occured' })
    expect(wrapper.root.findAllByType(PopoverTooltip).length).toBe(1)
  })
  it('has priority over <Right /> component', () => {
    const { wrapper } = givenTextInput({
      error: 'An error occured',
      Right: () => <EmojiPickerToggler />,
    })
    expect(wrapper.root.findAllByType(PopoverTooltip).length).toBe(1)
    expect(wrapper.root.findAllByType(EmojiPickerToggler).length).toBe(0)
  })
})

it('handles value change', () => {
  const { wrapper, props } = givenTextInput()
  const message = 'hello world'
  fireEvent.changeText(wrapper.root.findByType(RNTextInput), message)
  expect(props.onValueChange).toBeCalledTimes(1)
  expect(props.onValueChange).toBeCalledWith(message, props.fieldName)
})

it('handles onBlur', () => {
  const { wrapper, props } = givenTextInput()
  fireEvent(wrapper.root.findByType(RNTextInput), 'onBlur')
  expect(props.onBlur).toBeCalledTimes(1)
  expect(props.onBlur).toBeCalledWith(props.fieldName)
})

describe('emoji picker', () => {
  it('renders emoji picker', () => {
    const { wrapper } = givenTextInput({ withEmoji: true })
    expect(wrapper.root.findAllByType(EmojiPickerToggler).length).toBe(1)
    expect(wrapper.root.findAllByType(EmojiKeyboard).length).toBe(1)
  })

  it('toggles emoji picker', () => {
    const { wrapper } = givenTextInput({ withEmoji: true })

    expect(wrapper.root.findByType(EmojiPickerToggler).props.isActive).toBe(false)
    expect(wrapper.root.findByType(EmojiKeyboard).props.showEmojiPicker).toBe(false)

    fireEvent.press(wrapper.root.findByType(EmojiPickerToggler))

    expect(wrapper.root.findByType(EmojiPickerToggler).props.isActive).toBe(true)
    expect(wrapper.root.findByType(EmojiKeyboard).props.showEmojiPicker).toBe(true)

    fireEvent.press(wrapper.root.findByType(EmojiPickerToggler))

    expect(wrapper.root.findByType(EmojiPickerToggler).props.isActive).toBe(false)
    expect(wrapper.root.findByType(EmojiKeyboard).props.showEmojiPicker).toBe(false)
  })
  it('handles blur', () => {
    const { wrapper } = givenTextInput({ withEmoji: true })
    expect(wrapper.root.findByType(EmojiKeyboard).props.hide).toBe(false)
    fireEvent.press(wrapper.root.findByType(EmojiPickerToggler))
    fireEvent(wrapper.root.findByType(RNTextInput), 'onBlur')
    expect(wrapper.root.findByType(EmojiKeyboard).props.hide).toBe(true)
  })
  it('selects emoji', () => {
    const { wrapper } = givenTextInput({ withEmoji: true })
    fireEvent(wrapper.root.findByType(EmojiKeyboard), 'onSelectEmoji', keyboardName, '😀')
    expect(wrapper.root.findByType(RNTextInput).props.value).toBe('😀')
  })
  it('dont select emoji if keyboardname is unknown', () => {
    const { wrapper } = givenTextInput({ withEmoji: true })
    const oldValue = wrapper.root.findByType(RNTextInput).props.value
    fireEvent(wrapper.root.findByType(EmojiKeyboard), 'onSelectEmoji', 'fake-keyboard', '😀')
    const newValue = wrapper.root.findByType(RNTextInput).props.value
    expect(oldValue).toBe(newValue)
  })
})
