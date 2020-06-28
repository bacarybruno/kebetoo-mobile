import React from 'react'
import { NavigationContainer } from '@react-navigation/native'

import configureStore from 'redux-mock-store'
import auth from '@react-native-firebase/auth'

import setupTest from 'Kebetoo/src/config/jest-setup'

import AppNavigation, {
  TabPage, OnboardingStack, tabPages, loggedInPages, notLoggedInPages, onboardingPages,
} from '../index'

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
  it('renders AppNavigation for authenticated user', () => {
    auth.setMockOptions({
      currentUser: {
        displayName: 'Bruno Bodian',
      },
    })
    const { wrapper } = givenAppNavigation()
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('has 5 pages for authenticated users', () => {
    expect(loggedInPages.length).toBe(5)
  })

  it('has 1 page for unauthenticated users', () => {
    expect(notLoggedInPages.length).toBe(1)
  })

  it('renders AppNavigation for unauthenticated user', () => {
    auth.setMockOptions({
      currentUser: null,
    })
    const { wrapper } = givenAppNavigation()
    expect(wrapper.toJSON()).toMatchSnapshot()
  })


})
