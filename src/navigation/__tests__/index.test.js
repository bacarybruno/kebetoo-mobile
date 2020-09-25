import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import configureStore from 'redux-mock-store'
import auth from '@react-native-firebase/auth'
import { fireEvent, act } from 'react-native-testing-library'

import setupTest from '@app/config/jest-setup'
import { useAnalytics } from '@app/shared/hooks'

import AppNavigation, {
  TabPage, OnboardingStack, tabPages, loggedInPages, notLoggedInPages, onboardingPages,
} from '../index'

const mockStore = configureStore()
const store = mockStore({
  postsReducer: {
    posts: [],
    authors: [],
  },
  notificationsReducer: {
    notifications: [],
  },
  userReducer: {},
})

const givenAppNavigation = setupTest(AppNavigation)({
  store,
})


describe('tabs', () => {
  const TabNavigation = () => (
    <NavigationContainer>
      <TabPage />
    </NavigationContainer>
  )

  const givenTabPage = setupTest(TabNavigation)({
    store,
  })

  it('renders TabNavigation', () => {
    const { wrapper } = givenTabPage()
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('renders 5 tabs', () => {
    expect(tabPages.length).toBe(5)
  })
})

describe('onboarding', () => {
  const OnboardingNavigation = () => (
    <NavigationContainer>
      <OnboardingStack />
    </NavigationContainer>
  )

  const givenOnboardingStack = setupTest(OnboardingNavigation)()

  it('renders OnboardingNavigation', () => {
    const { wrapper } = givenOnboardingStack()
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('renders 3 onboarding pages', () => {
    expect(onboardingPages.length).toBe(3)
  })
})

describe('app navigation', () => {
  it('renders AppNavigation for authenticated user', async () => {
    auth.setMockOptions({
      currentUser: {
        displayName: 'Bruno Bodian',
      },
    })
    const { wrapper } = await givenAppNavigation()
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('has 5 pages for authenticated users', () => {
    expect(loggedInPages.length).toBe(6)
  })

  it('has 1 page for unauthenticated users', () => {
    expect(notLoggedInPages.length).toBe(1)
  })

  it('renders AppNavigation for unauthenticated user', async () => {
    auth.setMockOptions({
      currentUser: null,
    })
    let wrapper
    await act(async () => {
      const { wrapper: asyncWrapper } = await givenAppNavigation()
      wrapper = asyncWrapper
    })
    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})

describe('route state change', () => {
  it('handles route state change', () => {
    const getCurrentRoute = jest.fn()
    getCurrentRoute.mockReturnValue('route:first')
    const { wrapper } = givenAppNavigation()
    const navigationContainer = wrapper.root.findByType(NavigationContainer)
    navigationContainer.props.testRef.current = {
      getCurrentRoute,
    }
    fireEvent(navigationContainer, 'onStateChange')
    expect(getCurrentRoute).toBeCalledTimes(1)
  })
})
