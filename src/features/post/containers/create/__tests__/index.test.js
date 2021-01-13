import setupTest from '@app/config/jest-setup'

import CreatePost, { actionTypes } from '../index'

const givenCreatePost = setupTest(CreatePost)({
  navigation: {
    navigate: jest.fn(),
    setOptions: jest.fn(),
    dispatch: jest.fn(),
  },
  route: {
    params: {
      action: actionTypes.CREATE,
      sharedFile: 'fake-image.png',
      sharedText: 'hello world',
      payload: {
        content: 'hello content',
      },
    },
  },
})

it('renders CreatePost', () => {
  const { wrapper } = givenCreatePost()
  expect(wrapper.toJSON()).toMatchSnapshot()
})