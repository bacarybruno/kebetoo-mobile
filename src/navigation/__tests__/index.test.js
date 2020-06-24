import configureStore from 'redux-mock-store'
import auth from '@react-native-firebase/auth'

import setupTest from 'Kebetoo/src/config/jest-setup'

import AppNavigation from '../index'

const mockStore = configureStore()
const store = mockStore({
  postsReducer: {
    posts: {},
    authors: {},
  },
  userReducer: {},
})

const givenAppNavigation = setupTest(AppNavigation)({
  store,
})

it('renders AppNavigation for authenticated user', () => {
  auth.setMockOptions({
    currentUser: {
      displayName: 'Bruno Bodian',
    },
  })
  const { wrapper } = givenAppNavigation()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders AppNavigation for unauthenticated user', () => {
  auth.setMockOptions({
    currentUser: null,
  })
  const { wrapper } = givenAppNavigation()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
