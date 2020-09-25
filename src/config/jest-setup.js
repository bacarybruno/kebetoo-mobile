/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { NativeModules } from 'react-native'
import TestRenderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import MockDate from 'mockdate'
import configureStore from 'redux-mock-store'
import 'react-native-gesture-handler/jestSetup'
import { renderHook } from '@testing-library/react-hooks'

// wix/react-native-keyboard-input
NativeModules.KeyboardTrackingViewTempManager = {
  KeyboardTrackingScrollBehaviorNone: 'NONE',
  KeyboardTrackingScrollBehaviorScrollToBottomInvertedOnly: 'SCROLL_TO_BOTTOM_INVERTED_ONLY',
  KeyboardTrackingScrollBehaviorFixedOffset: 'FIXED_OFFSET',
}

// Silence the warning https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

// helper to setup unit tests
/* eslint-disable comma-dangle */
const setupTest = (WrappedComponent, renderFn = TestRenderer.create) => {
  let wrapper = null
  return (defaultProps = {}) => (additionalProps = {}) => {
    const { store, ...props } = defaultProps
    const propsWithArgs = {
      ...props,
      ...additionalProps,
    }
    const mockStore = configureStore()
    const Component = (
      <Provider store={store || mockStore()}>
        <WrappedComponent {...propsWithArgs} />
      </Provider>
    )
    wrapper = renderFn(Component)
    return { wrapper, props: propsWithArgs }
  }
}

export const setupHook = (useHook, ...props) => {
  const mockStore = configureStore()
  const store = mockStore()
  const wrapper = ({ children }) => (
    <Provider store={store}>
      {children}
    </Provider>
  )
  const rendered = renderHook(() => useHook(...props), {
    wrapper,
  })
  return rendered
}

/**
 * Explicit mocks
 * Create mocks here only if they can't be created on the __mocks__ folder
 */

jest.useFakeTimers()
jest.setTimeout(30000)

// react-navigation
const mockedNavigate = jest.fn()
const mockedSetOptions = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockedNavigate,
    setOptions: mockedSetOptions,
    addListener: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  useFocusEffect: (cb) => cb()
}))
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock')

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => { }

  return Reanimated
})

// react-native-screens
jest.mock('react-native-screens', () => {
  const Screens = jest.requireActual('react-native-screens')
  Screens.enableScreens = () => { }
  return Screens
})

// date
MockDate.set(new Date(Date.parse('2020-06-25T13:30:00+02:00')))

export default setupTest
