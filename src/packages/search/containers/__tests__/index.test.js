import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import configureStore from 'redux-mock-store'

import setupTest from 'Kebetoo/src/config/jest-setup'

import SearchPage from '../index'

const SearchPageNavigation = () => (
  <NavigationContainer>
    <SearchPage />
  </NavigationContainer>
)
const mockStore = configureStore()
const store = mockStore({
  userReducer: {
    searchHistory: {
      posts: ['first post', 'covid19'],
      users: ['john', 'doe']
    }
  },
})
const givenSearchPage = setupTest(SearchPageNavigation)({
  store,
})

it('renders SearchPage', () => {
  const { wrapper } = givenSearchPage()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
