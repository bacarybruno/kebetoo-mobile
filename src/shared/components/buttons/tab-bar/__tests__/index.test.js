import ActionButton from 'react-native-action-button'
import { fireEvent } from 'react-native-testing-library'
import { useNavigation } from '@react-navigation/native'

import setupTest from '@app/config/jest-setup'

import TabBar from '../index'

const givenTabBar = setupTest(TabBar)({
  route: 'routes:dummy',
})

it('renders TabBar', () => {
  const { wrapper } = givenTabBar()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('handles button press', () => {
  const { wrapper, props } = givenTabBar()
  fireEvent.press(wrapper.root.findByType(ActionButton))
  expect(useNavigation().navigate).toBeCalledTimes(1)
  expect(useNavigation().navigate).toBeCalledWith(props.route)
})
