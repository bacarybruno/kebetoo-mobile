import { TextInput as RNTextInput } from 'react-native'
import { fireEvent } from 'react-native-testing-library'
import { act } from 'react-test-renderer'

import setupTest from '@app/config/jest-setup'

import PasswordInput, { EyeButton } from '../password'
import { PopoverTooltip } from '../text'

const givenPasswordInput = setupTest(PasswordInput)({
  onValueChange: jest.fn(),
  fieldName: 'password',
})

it('renders PasswordInput', () => {
  const { wrapper } = givenPasswordInput()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('shows popover tooltip on error', () => {
  const { wrapper } = givenPasswordInput({ error: 'An error occured' })
  expect(wrapper.root.findAllByType(PopoverTooltip).length).toBe(1)
})

it('handles value change', () => {
  const { wrapper, props } = givenPasswordInput()
  const password = 'myaw3s0Mep@$$'
  act(() => {
    fireEvent.changeText(wrapper.root.findByType(RNTextInput), password)
  })
  expect(props.onValueChange).toBeCalledTimes(1)
  expect(props.onValueChange).toBeCalledWith(password, props.fieldName)
})

it('toggles eye icon', () => {
  const { wrapper } = givenPasswordInput()
  expect(wrapper.root.findByType(RNTextInput).props.secureTextEntry).toBe(true)
  act(() => {
    fireEvent.press(wrapper.root.findByType(EyeButton))
  })
  expect(wrapper.root.findByType(RNTextInput).props.secureTextEntry).toBe(false)
  act(() => {
    fireEvent.press(wrapper.root.findByType(EyeButton))
  })
  expect(wrapper.root.findByType(RNTextInput).props.secureTextEntry).toBe(true)
})
