import React from 'react'
import * as redux from 'react-redux'
import configureStore from 'redux-mock-store'
import { act } from 'react-test-renderer'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import setupTest from 'Kebetoo/src/config/jest-setup'
import strings from 'Kebetoo/src/config/strings'
import authors from 'Kebetoo/__fixtures__/authors'
import * as api from 'Kebetoo/src/shared/helpers/http'
import BasicPost from 'Kebetoo/src/packages/post/containers/basic-post'
import NoResult from 'Kebetoo/src/packages/search/components/no-result'
import HistoryItem from 'Kebetoo/src/packages/search/components/history-item'
import * as types from 'Kebetoo/src/redux/types'

import SearchPosts, { SearchHistoryHeader } from '../index'

const Stack = createStackNavigator()

const posts = [{
  content: 'Hello World',
  author: authors[0],
  reactions: [],
  comments: [],
}, {
  content: 'Hellow Kebetoo',
  author: authors[1],
  reactions: [],
  comments: [],
}, {
  content: 'Covid19 Update',
  author: authors[0],
  reactions: [],
  comments: [],
}]

const mockStore = configureStore()
const store = mockStore({
  userReducer: {
    searchHistory: {
      posts: ['first post', 'covid19'],
    },
  },
})

const SearchPostsNavigation = (ownProps) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name={strings.search.posts_tab}>
        {(props) => <SearchPosts {...ownProps} {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
)

api.searchPosts = jest.fn().mockImplementation(async (query) => {
  const results = posts.filter((post) => (
    post.content?.toLowerCase().includes(query.toLowerCase())
  ))
  return results
})

const givenSearchPosts = setupTest(SearchPostsNavigation)({
  store,
  searchQuery: '',
  onSearch: jest.fn(),
  onRecentSearch: jest.fn(),
})

it('renders SearchPosts history', async () => {
  let wrapper
  let props

  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  const mockDispatchFn = jest.fn()
  useDispatchSpy.mockReturnValue(mockDispatchFn)

  await act(async () => {
    const { wrapper: asyncWrapper, props: asyncProps } = await givenSearchPosts()
    wrapper = asyncWrapper
    props = asyncProps
  })

  expect(wrapper.toJSON()).toMatchSnapshot()
  expect(wrapper.root.findAllByType(BasicPost).length).toBe(0)
  expect(wrapper.root.findAllByType(HistoryItem).length).toBe(2)

  act(() => {
    wrapper.root.findAllByType(HistoryItem)[0].props.onPress()
  })

  expect(props.onRecentSearch).toBeCalledTimes(1)

  act(() => {
    wrapper.root.findAllByType(HistoryItem)[0].props.onDelete('post-to-delete')
  })

  expect(mockDispatchFn).toBeCalledTimes(1)
  expect(mockDispatchFn).toBeCalledWith({ type: types.REMOVE_POST_HISTORY, payload: 'post-to-delete' })

  act(() => {
    wrapper.root.findAllByType(SearchHistoryHeader)[0].props.onClear()
  })

  expect(mockDispatchFn).toBeCalledWith({ type: types.CLEAR_POST_HISTORY })

  useDispatchSpy.mockClear()
})

it('renders SearchPosts results', async () => {
  let wrapper
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenSearchPosts({
      searchQuery: ' hello ',
    })
    wrapper = asyncWrapper
  })

  expect(wrapper.toJSON()).toMatchSnapshot()
  expect(wrapper.root.findAllByType(BasicPost).length).toBe(2)
})

it('renders SearchPosts empty results', async () => {
  let wrapper
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenSearchPosts({
      searchQuery: 'Bruno',
    })
    wrapper = asyncWrapper
  })

  expect(wrapper.root.findAllByType(BasicPost).length).toBe(0)
  expect(wrapper.root.findAllByType(NoResult).length).toBe(1)
})
