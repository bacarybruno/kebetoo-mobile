import { render, fireEvent } from 'react-native-testing-library'

import setupTest from 'Kebetoo/src/config/jest-setup'

import FullButton from '../index'

const givenFullButton = setupTest(FullButton, render)({
  text: 'New',
  style: { backgroundColor: 'red', color: 'white' },
  onPress: jest.fn(),
})

it('renders FullButton', () => {
  const { wrapper } = givenFullButton()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('handles button press', () => {
  const { wrapper, props } = givenFullButton()
  fireEvent.press(wrapper.getByText(props.text.toUpperCase()))
  expect(props.onPress).toBeCalledTimes(1)
})
