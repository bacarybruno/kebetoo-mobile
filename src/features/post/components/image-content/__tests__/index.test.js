import { render, fireEvent } from 'react-native-testing-library'

import setupTest from 'Kebetoo/src/config/jest-setup'

import ImageContent from '../index'

const givenImageContent = setupTest(ImageContent, render)({
  content: 'test image',
  url: '/fake-image.png',
  style: { elevation: 3 },
  onPress: jest.fn(),
})

it('renders ImageContent', () => {
  const { wrapper } = givenImageContent()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders ImageContent on comments mode', () => {
  const { wrapper } = givenImageContent({
    mode: 'comments',
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('handles player press', () => {
  const { wrapper, props } = givenImageContent()
  fireEvent.press(wrapper.getByTestId('image-viewer'))
  expect(props.onPress).toBeCalledTimes(1)
})
