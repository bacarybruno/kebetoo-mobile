import { TextInput as RNTextInput } from 'react-native'
import { fireEvent } from 'react-native-testing-library'
import { act } from 'react-test-renderer'

import setupTest from '@app/config/jest-setup'

import TextInput, { PopoverTooltip } from '../text'

const givenTextInput = setupTest(TextInput)({
  onValueChange: jest.fn(),
  onBlur: jest.fn(),
  fieldName: 'fullname',
})

it('renders TextInput', () => {
  const { wrapper } = givenTextInput()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('shows popover tooltip on error', () => {
  const { wrapper } = givenTextInput({ error: 'An error occured' })
  expect(wrapper.root.findAllByType(PopoverTooltip).length).toBe(1)
})

it('handles value change', () => {
  const { wrapper, props } = givenTextInput()
  const message = 'hello world'
  act(() => {
    fireEvent.changeText(wrapper.root.findByType(RNTextInput), message)
  })
  expect(props.onValueChange).toBeCalledTimes(1)
  expect(props.onValueChange).toBeCalledWith(message, props.fieldName)
})

it('handles onBlur', () => {
  const { wrapper, props } = givenTextInput()
  act(() => {
    fireEvent(wrapper.root.findByType(RNTextInput), 'onBlur')
  })
  expect(props.onBlur).toBeCalledTimes(1)
  expect(props.onBlur).toBeCalledWith(props.fieldName)
})
