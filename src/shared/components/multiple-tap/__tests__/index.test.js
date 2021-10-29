import { View } from 'react-native';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import { fireEvent } from 'react-native-testing-library';

import setupTest from '@app/config/jest-setup';

import MultipleTapHandler from '../index';

beforeEach(jest.clearAllMocks);

const givenMultipleTapHandler = setupTest(MultipleTapHandler)({
  onPress: jest.fn(),
  onDoublePress: jest.fn(),
  children: <View />,
});

it('renders MultipleTapHandler', () => {
  const { wrapper } = givenMultipleTapHandler();
  expect(wrapper.toJSON()).toMatchSnapshot();
});

it('handles press', () => {
  const { wrapper, props } = givenMultipleTapHandler();
  const presser = wrapper.root.findAllByType(TapGestureHandler)[0];
  fireEvent.press(presser);
  expect(props.onPress).toBeCalledTimes(1);
  expect(props.onDoublePress).toBeCalledTimes(0);
});

it('handles press without gesture handler', () => {
  const { wrapper, props } = givenMultipleTapHandler();
  const presser = wrapper.root.findAllByType(TapGestureHandler)[0];
  presser.props.onHandlerStateChange({ nativeEvent: { state: State.ACTIVE } });
  expect(props.onPress).toBeCalledTimes(1);
  expect(props.onDoublePress).toBeCalledTimes(0);
});

it('handles double press without gesture handler', () => {
  const { wrapper, props } = givenMultipleTapHandler();
  const presser = wrapper.root.findAllByType(TapGestureHandler)[1];
  presser.props.onHandlerStateChange({ nativeEvent: { state: State.ACTIVE } });
  expect(props.onPress).toBeCalledTimes(0);
  expect(props.onDoublePress).toBeCalledTimes(1);
});
