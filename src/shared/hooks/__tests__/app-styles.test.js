/* eslint-disable import/namespace */
import { setupHook } from '@app/config/jest-setup'
import * as selectors from '@app/redux/selectors'

import useAppStyles from '../app-styles'

const createThemedStyles = (colors) => ({
  container: {
    colorScheme: colors.colorScheme,
  },
})

const givenAppStyles = () => {
  const rendered = setupHook(useAppStyles, createThemedStyles)
  return { appStyles: rendered.result.current, rerender: rendered.rerender }
}

it('is defined', () => {
  expect(useAppStyles).toBeDefined()
})

it('has a default theme', () => {
  selectors.appSelector = jest.fn().mockReturnValue({ theme: 'system' })
  const rendered = givenAppStyles()
  expect(rendered.appStyles.container.colorScheme).toBe('light')
})

it('has a light theme', () => {
  selectors.appSelector = jest.fn().mockReturnValue({ theme: 'light' })
  const rendered = givenAppStyles()
  expect(rendered.appStyles.container.colorScheme).toBe('light')
})

it('has a dark theme', () => {
  selectors.appSelector = jest.fn().mockReturnValue({ theme: 'dark' })
  const rendered = givenAppStyles()
  expect(rendered.appStyles.container.colorScheme).toBe('dark')
})

it('fallbacks to light theme if theme is unknown', () => {
  selectors.appSelector = jest.fn().mockReturnValue(undefined)
  const rendered = givenAppStyles()
  expect(rendered.appStyles.container.colorScheme).toBe('light')
})
