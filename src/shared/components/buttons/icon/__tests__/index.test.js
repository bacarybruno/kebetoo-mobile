import { fireEvent } from 'react-native-testing-library'
import { TouchableOpacity } from 'react-native'

import setupTest from '@app/config/jest-setup'

import IconButton from '../index'

const givenIconButton = setupTest(IconButton)({
  iconName: 'md-woman',
  style: { backgroundColor: 'red', color: 'white' },
  onPress: jest.fn(),
})

it('renders IconButton', () => {
  const { wrapper } = givenIconButton()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('handles button press', () => {
  const { wrapper, props } = givenIconButton()
  fireEvent.press(wrapper.root.findByType(TouchableOpacity))
  expect(props.onPress).toBeCalledTimes(1)
})
