/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import TestRenderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import MockDate from 'mockdate'

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
    if (store) {
      wrapper = renderFn(
        <Provider store={store}>
          <WrappedComponent {...propsWithArgs} />
        </Provider>
      )
    } else {
      wrapper = renderFn(<WrappedComponent {...propsWithArgs} />)
    }
    return { wrapper, props: propsWithArgs }
  }
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

// react-native-screens
jest.mock('react-native-screens', () => {
  const Screens = jest.requireActual('react-native-screens')
  Screens.enableScreens = () => {}
  return Screens
})

// date
MockDate.set(new Date(Date.parse('2020-06-25T13:30:00+02:00')))

export default setupTest
