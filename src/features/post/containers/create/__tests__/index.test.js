import setupTest from '@app/config/jest-setup'

import CreatePost from '../index'

const givenCreatePost = setupTest(CreatePost)({
  navigation: {
    navigate: jest.fn(),
    setOptions: jest.fn(),
  },
})

it('renders CreatePost', () => {
  const { wrapper } = givenCreatePost()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
