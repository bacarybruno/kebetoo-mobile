import { fireEvent } from 'react-native-testing-library'

import setupTest from '@app/config/jest-setup'
import { strings } from '@app/config'

import OutlinedButton from '../index'

const givenOutlinedButton = setupTest(OutlinedButton)({
  text: strings.general.new,
  style: { backgroundColor: 'red', color: 'white' },
  onPress: jest.fn(),
})

it('renders OutlinedButton', () => {
  const { wrapper } = givenOutlinedButton()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders disabled OutlinedButton', () => {
  const { wrapper } = givenOutlinedButton({
    disabled: true,
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('handles button press', () => {
  const { wrapper, props } = givenOutlinedButton()
  fireEvent.press(wrapper.root.findByProps({ text: props.text }))
  expect(props.onPress).toBeCalledTimes(1)
})
