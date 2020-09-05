import configureStore from 'redux-mock-store'

import setupTest from 'Kebetoo/src/config/jest-setup'

import CreatePost from '../index'

const mockStore = configureStore()
const store = mockStore({
  postsReducer: {
    posts: [],
    authors: [],
  },
  notificationsReducer: {
    notifications: [],
  },
  userReducer: [],
})
const givenCreatePost = setupTest(CreatePost)({
  navigation: {
    navigate: jest.fn(),
    setOptions: jest.fn(),
  },
  store,
})

it('renders CreatePost', () => {
  const { wrapper } = givenCreatePost()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
