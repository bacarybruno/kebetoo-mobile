import configureStore from 'redux-mock-store'

import setupTest from 'Kebetoo/src/config/jest-setup'
import posts from 'Kebetoo/__fixtures__/posts'
import authors from 'Kebetoo/__fixtures__/authors'

import RepostContent from '../index'

const mockStore = configureStore()
const store = mockStore()

const givenRepostContent = setupTest(RepostContent)({
  post: posts.repost,
  originalAuthor: authors[0],
  style: { elevation: 1 },
  onPress: jest.fn(),
  store,
})

it('renders RepostContent', () => {
  const { wrapper } = givenRepostContent()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
