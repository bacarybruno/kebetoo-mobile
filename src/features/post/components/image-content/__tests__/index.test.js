import { render, fireEvent } from 'react-native-testing-library';

import setupTest from '@app/config/jest-setup';

import ImageContent, { ImageViewer, DeleteIconButton } from '../index';

const givenImageContent = setupTest(ImageContent, render)({
  content: 'test image',
  url: '/fake-image.png',
  style: { elevation: 3 },
  onPress: jest.fn(),
});

it('renders ImageContent', () => {
  const { wrapper } = givenImageContent();
  expect(wrapper.toJSON()).toMatchSnapshot();
});

it('renders ImageContent on comments mode', () => {
  const { wrapper } = givenImageContent({
    mode: 'comments',
  });
  expect(wrapper.toJSON()).toMatchSnapshot();
});

it('handles viewer press', () => {
  const { wrapper, props } = givenImageContent();
  fireEvent.press(wrapper.getByTestId('image-viewer'));
  expect(props.onPress).toBeCalledTimes(1);
});

it('handles image viewer delete event', () => {
  const givenImageViewer = setupTest(ImageViewer)();
  const { wrapper, props } = givenImageViewer({
    onDelete: jest.fn(),
  });
  const deleteButton = wrapper.root.findByType(DeleteIconButton);
  deleteButton.props.onPress();
  expect(props.onDelete).toBeCalledTimes(1);
});
