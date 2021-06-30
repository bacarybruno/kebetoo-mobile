import { ActivityIndicator } from 'react-native'
import { act } from 'react-test-renderer'
import auth from '@react-native-firebase/auth'

import setupTest from '@app/config/jest-setup'
import { strings } from '@app/config'

import routes from '@app/navigation/routes'
import SearchPage, { SearchIcon, CancelIcon } from '../index'
import SearchUsers from '../users'

const givenSearchPage = setupTest(SearchPage)({
  __storeState__: {
    userReducer: {
      searchHistory: {
        posts: ['first post', 'covid19'],
        users: ['john', 'doe'],
      },
      profile: auth().currentUser,
    },
  },
})

it('renders SearchPage for posts', () => {
  const { wrapper } = givenSearchPage()
  const segmentedControl = wrapper.root.findByProps({ testID: 'segmented-control' })
  segmentedControl.props.onSelect({ value: routes.SEARCH_POSTS })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders SearchPage for users', () => {
  const { wrapper } = givenSearchPage()
  const segmentedControl = wrapper.root.findByProps({ testID: 'segmented-control' })
  segmentedControl.props.onSelect({ value: routes.SEARCH_USERS })
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
      await wrapper.root.findByType(SearchUsers).props.onRecentSearch('hello')
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
    wrapper.root.findByType(SearchUsers).props.onSearch('')
  })
  expect(wrapper.root.findAllByType(ActivityIndicator).length).toBe(1)
})
