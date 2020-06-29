import configureStore from 'redux-mock-store'
import { act } from 'react-test-renderer'
import ReceiveSharingIntent from 'react-native-receive-sharing-intent'

import setupTest from 'Kebetoo/src/config/jest-setup'
import posts from 'Kebetoo/__fixtures__/posts'
import authors from 'Kebetoo/__fixtures__/authors'
import normalizeData from 'Kebetoo/src/redux/misc/normalizer'

import HomePage from '../index'

const findAuthorById = (authorId) => authors.find((author) => author.uid === authorId)
const normalizeAuthors = (data) => {
  const result = {}
  data.forEach((author) => {
    result[author.uid] = author
  })
  return result
}

const { entities } = normalizeData(Object.values(posts))
const mockStore = configureStore()
const store = mockStore({
  postsReducer: {
    posts: entities.posts,
    authors: normalizeAuthors(Object.keys(entities.authors).map(findAuthorById)),
  },
  userReducer: {},
})
const givenHomePage = setupTest(HomePage)({
  store,
})

it('renders HomePage', () => {
  let wrapper
  act(() => {
    const { wrapper: asyncWrapper } = givenHomePage()
    wrapper = asyncWrapper
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('search for shared file', () => {
  givenHomePage()
  expect(ReceiveSharingIntent.getReceivedFiles).toBeCalledTimes(1)
  expect(ReceiveSharingIntent.clearReceivedFiles).toBeCalledTimes(1)
})
