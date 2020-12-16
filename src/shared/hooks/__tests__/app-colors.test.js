/* eslint-disable import/namespace */
import { setupHook } from '@app/config/jest-setup'
import * as selectors from '@app/redux/selectors'

import useAppColors from '../app-colors'

const givenAppColors = () => {
  const rendered = setupHook(useAppColors)
  return { appColors: rendered.result.current, rerender: rendered.rerender }
}

it('is defined', () => {
  expect(useAppColors).toBeDefined()
})

it('has a default theme', () => {
  selectors.appSelector = jest.fn().mockReturnValue({ theme: 'system' })
  const rendered = givenAppColors()
  expect(rendered.appColors.colorScheme).toBe('light')
})

it('has a light theme', () => {
  selectors.appSelector = jest.fn().mockReturnValue({ theme: 'light' })
  const rendered = givenAppColors()
  expect(rendered.appColors.colorScheme).toBe('light')
})

it('has a dark theme', () => {
  selectors.appSelector = jest.fn().mockReturnValue({ theme: 'dark' })
  const rendered = givenAppColors()
  expect(rendered.appColors.colorScheme).toBe('dark')
})

it('fallbacks to light theme if theme is unknown', () => {
  selectors.appSelector = jest.fn().mockReturnValue(undefined)
  const rendered = givenAppColors()
  expect(rendered.appColors.colorScheme).toBe('light')
})
