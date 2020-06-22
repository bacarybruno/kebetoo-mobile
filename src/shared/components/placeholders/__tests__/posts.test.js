import setupTest from 'Kebetoo/src/config/jest-setup'

import PostsPlaceholder from '../posts'

const givenPostsPlaceholder = setupTest(PostsPlaceholder)({
  withReactions: true,
  avatarSize: 20,
})

it('renders PostsPlaceholder', () => {
  const { wrapper } = givenPostsPlaceholder()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders PostsPlaceholder without reactions', () => {
  const { wrapper } = givenPostsPlaceholder({
    withReactions: false,
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})
