import { fireEvent } from 'react-native-testing-library'

import setupTest from '@app/config/jest-setup'
import { keyboardName } from '@app/shared/components/emoji-selector'

import EmojiTextInput, { EmojiPickerToggler, EmojiKeyboard } from '../emoji'
import TextInput from '../text'

jest.mock('react-native-ui-lib/keyboard', () => ({
  ...jest.requireActual('react-native-ui-lib/keyboard'),
  KeyboardUtils: {
    dismiss: jest.fn(),
  },
}))

const givenEmojiTextInput = setupTest(EmojiTextInput)({
  onValueChange: jest.fn(),
  fieldName: 'comment',
  value: '😀😀😀',
})

it('renders EmojiTextInput', () => {
  const { wrapper } = givenEmojiTextInput()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('handles value change', () => {
  const { wrapper, props } = givenEmojiTextInput()
  const message = 'hello world 😀'
  fireEvent.changeText(wrapper.root.findByType(TextInput), message)
  expect(props.onValueChange).toBeCalledTimes(1)
  expect(props.onValueChange).toBeCalledWith(message, props.fieldName)
})

describe('emoji picker', () => {
  beforeEach(jest.clearAllMocks)
  it('renders emoji picker', () => {
    const { wrapper } = givenEmojiTextInput()
    expect(wrapper.root.findAllByType(EmojiPickerToggler).length).toBe(1)
    expect(wrapper.root.findAllByType(EmojiKeyboard).length).toBe(1)
  })

  it('toggles emoji picker', () => {
    const { wrapper } = givenEmojiTextInput()

    expect(wrapper.root.findByType(EmojiPickerToggler).props.isActive).toBe(false)
    expect(wrapper.root.findByType(EmojiKeyboard).props.showEmojiPicker).toBe(false)

    fireEvent.press(wrapper.root.findByType(EmojiPickerToggler))

    expect(wrapper.root.findByType(EmojiPickerToggler).props.isActive).toBe(true)
    expect(wrapper.root.findByType(EmojiKeyboard).props.showEmojiPicker).toBe(true)

    fireEvent.press(wrapper.root.findByType(EmojiPickerToggler))

    expect(wrapper.root.findByType(EmojiPickerToggler).props.isActive).toBe(false)
    expect(wrapper.root.findByType(EmojiKeyboard).props.showEmojiPicker).toBe(false)
  })
  it('toggles blur and focus', () => {
    const { wrapper } = givenEmojiTextInput()
    expect(wrapper.root.findByType(EmojiKeyboard).props.hide).toBe(false)
    fireEvent.press(wrapper.root.findByType(EmojiPickerToggler))
    fireEvent(wrapper.root.findByType(TextInput), 'onBlur')
    expect(wrapper.root.findByType(EmojiKeyboard).props.hide).toBe(true)
    fireEvent(wrapper.root.findByType(TextInput), 'onFocus')
    expect(wrapper.root.findByType(EmojiKeyboard).props.hide).toBe(false)
  })
  it('switches keyboard mode when touched', () => {
    const { wrapper } = givenEmojiTextInput()
    fireEvent.press(wrapper.root.findByType(EmojiPickerToggler))
    fireEvent(wrapper.root.findByType(TextInput), 'onTouchStart')
    expect(wrapper.root.findByType(EmojiKeyboard).props.showEmojiPicker).toBe(false)
  })
  it('selects emoji with the right keyboard', () => {
    const { wrapper, props } = givenEmojiTextInput({
      value: '',
    })
    fireEvent(wrapper.root.findByType(EmojiKeyboard), 'onSelectEmoji', keyboardName, '😀')
    expect(props.onValueChange).toBeCalledTimes(1)
    expect(props.onValueChange).toBeCalledWith('😀', props.fieldName)
  })
  it('dont select emoji if keyboardname is unknown', () => {
    const { wrapper, props } = givenEmojiTextInput()
    fireEvent(wrapper.root.findByType(EmojiKeyboard), 'onSelectEmoji', 'fake-keyboard', '😀')
    expect(props.onValueChange).not.toBeCalled()
  })
})
