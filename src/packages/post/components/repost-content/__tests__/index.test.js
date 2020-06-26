import setupTest from 'Kebetoo/src/config/jest-setup'
import posts from 'Kebetoo/__fixtures__/posts'
import authors from 'Kebetoo/__fixtures__/authors'

import RepostContent from '../index'

const givenRepostContent = setupTest(RepostContent)({
  post: posts.repost,
  originalAuthor: authors[0],
  style: { elevation: 1 },
  onPress: jest.fn(),
})

it('renders RepostContent', () => {
  const { wrapper } = givenRepostContent()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
