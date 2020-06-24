/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import TestRenderer from 'react-test-renderer'

// helper to setup unit tests
// eslint-disable-next-line arrow-body-style
const setupTest = (WrappedComponent, renderFn = TestRenderer.create) => {
  return (defaultProps = {}) => (additionalProps = {}) => {
    const propsWithArgs = {
      ...defaultProps,
      ...additionalProps,
    }
    const wrapper = renderFn(<WrappedComponent {...propsWithArgs} />)
    return { wrapper, props: propsWithArgs }
  }
}

/**
 * Explicit mocks
 * Create mocks here only if they can't be created on the __mocks__ folder
 */

jest.useFakeTimers()

// react-navigation
const mockedNavigate = jest.fn()
const mockedSetOptions = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockedNavigate,
    setOptions: mockedSetOptions,
  }),
  useRoute: () => ({
    params: {},
  }),
}))

// react-native-screens
jest.mock('react-native-screens', () => {
  const Screens = jest.requireActual('react-native-screens')
  Screens.enableScreens = () => {}
  return Screens
})

export default setupTest
