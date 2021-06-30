import setupTest from '@app/config/jest-setup';

import HistoryItem, { DeleteIconButton } from '../index';

const givenHistoryItem = setupTest(HistoryItem)({
  onPress: jest.fn(),
  onDelete: jest.fn(),
  item: 'John Doe',
});

it('renders HistoryItem', () => {
  const { wrapper } = givenHistoryItem();
  expect(wrapper.toJSON()).toMatchSnapshot();
});

it('handles onDelete', () => {
  const { wrapper, props } = givenHistoryItem();
  wrapper.root.findByType(DeleteIconButton).props.onPress();
  expect(props.onDelete).toBeCalledTimes(1);
  expect(props.onDelete).toBeCalledWith(props.item);
});

it('handles onPress', () => {
  const { wrapper, props } = givenHistoryItem();
  wrapper.root.findByProps({ testID: 'history-item' }).props.onPress();
  expect(props.onPress).toBeCalledTimes(1);
  expect(props.onPress).toBeCalledWith(props.item);
});
