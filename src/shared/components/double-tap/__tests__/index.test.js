import { View } from 'react-native'
import { TapGestureHandler, State } from 'react-native-gesture-handler'
import { fireEvent } from 'react-native-testing-library'

import setupTest from '@app/config/jest-setup'

import DoubleTapHandler from '../index'

beforeEach(jest.clearAllMocks)

const givenDoubleTapHandler = setupTest(DoubleTapHandler)({
  onPress: jest.fn(),
  onDoublePress: jest.fn(),
  children: <View />,
})

it('renders DoubleTapHandler', () => {
  const { wrapper } = givenDoubleTapHandler()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('handles press', () => {
  const { wrapper, props } = givenDoubleTapHandler()
  const presser = wrapper.root.findAllByType(TapGestureHandler)[0]
  fireEvent.press(presser)
  expect(props.onPress).toBeCalledTimes(1)
  expect(props.onDoublePress).toBeCalledTimes(0)
})

it('handles press without gesture handler', () => {
  const { wrapper, props } = givenDoubleTapHandler()
  const presser = wrapper.root.findAllByType(TapGestureHandler)[0]
  presser.props.onHandlerStateChange({ nativeEvent: { state: State.ACTIVE } })
  expect(props.onPress).toBeCalledTimes(1)
  expect(props.onDoublePress).toBeCalledTimes(0)
})

it('handles double press without gesture handler', () => {
  const { wrapper, props } = givenDoubleTapHandler()
  const presser = wrapper.root.findAllByType(TapGestureHandler)[1]
  presser.props.onHandlerStateChange({ nativeEvent: { state: State.ACTIVE } })
  expect(props.onPress).toBeCalledTimes(0)
  expect(props.onDoublePress).toBeCalledTimes(1)
})
