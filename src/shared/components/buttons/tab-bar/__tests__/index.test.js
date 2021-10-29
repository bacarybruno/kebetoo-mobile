import { fireEvent } from 'react-native-testing-library';
import { act } from 'react-test-renderer';
import { strings } from '@app/config';
import { StoriesPage } from '@app/navigation/pages';

import routes from '@app/navigation/routes';
import setupTest from '@app/config/jest-setup';

import TabBar, { BottomSheetContent } from '../index';

const givenTabBar = setupTest(TabBar)();
const givenBottomSheetContent = setupTest(BottomSheetContent)();

it('renders TabBar', () => {
  const { wrapper } = givenTabBar();
  expect(wrapper.toJSON()).toMatchSnapshot();
});

it('renders BottomSheetContent', () => {
  const { wrapper } = givenBottomSheetContent();
  expect(wrapper.toJSON()).toMatchSnapshot();
});

it('handles redirection to post creation page', () => {
  const navigate = jest.fn();
  const onDismiss = jest.fn();
  const { wrapper } = givenBottomSheetContent({ navigate, onDismiss });
  act(() => {
    fireEvent.press(wrapper.root.findByProps({ text: strings.tabbar.create_post }));
  });
  expect(navigate).toBeCalledTimes(1);
  expect(onDismiss).toBeCalledTimes(1);
  expect(navigate).toBeCalledWith(routes.CREATE_POST, undefined);
});

it('handles redirection to virals creation page', () => {
  const navigate = jest.fn();
  const onDismiss = jest.fn();
  const { wrapper } = givenBottomSheetContent({ navigate, onDismiss });
  act(() => {
    fireEvent.press(wrapper.root.findByProps({ text: strings.tabbar.create_viral }));
  });
  expect(navigate).toBeCalledTimes(1);
  expect(onDismiss).toBeCalledTimes(1);
  expect(navigate).toBeCalledWith(routes.STORIES, { mode: StoriesPage.Modes.CreateStory });
});

it('handles redirection to rooms creation page', () => {
  const navigate = jest.fn();
  const onDismiss = jest.fn();
  const { wrapper } = givenBottomSheetContent({ navigate, onDismiss });
  act(() => {
    fireEvent.press(wrapper.root.findByProps({ text: strings.tabbar.create_room }));
  });
  expect(navigate).toBeCalledTimes(1);
  expect(onDismiss).toBeCalledTimes(1);
  expect(navigate).toBeCalledWith(routes.CREATE_ROOM, undefined);
});
