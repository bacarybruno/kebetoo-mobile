import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import configureStore from 'redux-mock-store'
import { act } from 'react-test-renderer'

import setupTest from 'Kebetoo/src/config/jest-setup'
import strings from 'Kebetoo/src/config/strings'

import SearchPage, { SearchIcon, CancelIcon } from '../index'
import SearchPosts from '../posts'
import { ActivityIndicator } from 'react-native'

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
      users: ['john', 'doe'],
    },
  },
})

const givenSearchPage = setupTest(SearchPageNavigation)({
  store,
})

it('renders SearchPage', () => {
  const { wrapper } = givenSearchPage()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

describe('searchbar', () => {
  it('hides search bar by default', () => {
    const { wrapper } = givenSearchPage()
    expect(wrapper.root.findByProps({ title: strings.search.search })).toBeDefined()
  })

  it('shows search bar on search icon click', async () => {
    let wrapper
    await act(async () => {
      const { wrapper: wrapperAsync } = await givenSearchPage()
      wrapper = wrapperAsync
      await wrapper.root.findByType(SearchIcon).props.onPress()
    })
    expect(wrapper.root.findByProps({ placeholder: strings.search.placeholder })).toBeDefined()
  })

  it('shows search bar on recent search', async () => {
    let wrapper
    await act(async () => {
      const { wrapper: wrapperAsync } = await givenSearchPage()
      wrapper = wrapperAsync
    })

    await act(async () => {
      await wrapper.root.findByType(SearchPosts).props.onRecentSearch('hello')
    })

    expect(wrapper.root.findByProps({ placeholder: strings.search.placeholder })).toBeDefined()
  })

  it('toggles search bar', async () => {
    let wrapper
    await act(async () => {
      const { wrapper: wrapperAsync } = await givenSearchPage()
      wrapper = wrapperAsync
      await wrapper.root.findByType(SearchIcon).props.onPress()
    })

    act(() => {
      wrapper.root.findByType(CancelIcon).props.onPress()
    })

    expect(wrapper.root.findByProps({ title: strings.search.search })).toBeDefined()
  })
})

it('shows loading indicator on search', async () => {
  let wrapper
  await act(async () => {
    const { wrapper: wrapperAsync } = await givenSearchPage()
    wrapper = wrapperAsync
    wrapper.root.findByType(SearchPosts).props.onSearch('')
  })
  expect(wrapper.root.findAllByType(ActivityIndicator).length).toBe(1)
})
