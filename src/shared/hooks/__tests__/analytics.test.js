import firebaseAnalytics from '@react-native-firebase/analytics'
import firebaseCrashlytics from '@react-native-firebase/crashlytics'
import { setupHook } from '@app/config/jest-setup'

import useAnalytics from '../analytics'

const analyticsMock = firebaseAnalytics()
const crashlyticsMock = firebaseCrashlytics()

beforeEach(jest.clearAllMocks)

const givenAnalytics = () => {
  const rendered = setupHook(useAnalytics, analyticsMock, crashlyticsMock)
  return { analytics: rendered.result.current, rerender: rendered.rerender }
}

it('sets attributes', async () => {
  const attributes = {
    brand: expect.any(String),
    system: expect.any(String),
    type: expect.any(String),
    locale: expect.any(String),
    theme: expect.any(String),
  }
  const { rerender } = givenAnalytics()
  await rerender()
  await expect(analyticsMock.setUserProperties).toBeCalledTimes(1)
  await expect(analyticsMock.setUserProperties).toBeCalledWith(attributes)
  await expect(crashlyticsMock.setAttributes).toBeCalledTimes(1)
  await expect(crashlyticsMock.setAttributes).toBeCalledWith(attributes)
})

it('is defined', () => {
  const { analytics } = givenAnalytics()
  // crash
  expect(analytics.reportError).toBeDefined()
  // tracking
  expect(analytics.trackAppOpen).toBeDefined()
  expect(analytics.trackAppBackground).toBeDefined()
  expect(analytics.trackPageView).toBeDefined()
  expect(analytics.trackOnboardingStart).toBeDefined()
  expect(analytics.trackOnboardingEnd).toBeDefined()
  expect(analytics.trackSignIn).toBeDefined()
  expect(analytics.trackSignUp).toBeDefined()
  expect(analytics.trackSignOut).toBeDefined()
  expect(analytics.trackSearch).toBeDefined()
  expect(analytics.trackSelectPost).toBeDefined()
  expect(analytics.trackReceiveIntent).toBeDefined()
})

it('reports error ', () => {
  const { analytics } = givenAnalytics()
  const error = new Error('Something went wrong')
  analytics.reportError(error)
  expect(crashlyticsMock.recordError).toBeCalledTimes(1)
  expect(crashlyticsMock.recordError).toBeCalledWith(error)
})

it('tracks AppOpen', () => {
  const { analytics } = givenAnalytics()
  analytics.trackAppOpen()
  expect(analyticsMock.logAppOpen).toBeCalledTimes(1)
})

it('tracks AppBackground', () => {
  const { analytics } = givenAnalytics()
  analytics.trackAppBackground()
  expect(analyticsMock.logEvent).toBeCalledTimes(1)
  expect(analyticsMock.logEvent).toBeCalledWith('app_background')
})

it('tracks PageView', () => {
  const { analytics } = givenAnalytics()
  analytics.trackPageView()
  expect(analyticsMock.logScreenView).toBeCalledTimes(1)
})

it('tracks OnboardingStart', () => {
  const { analytics } = givenAnalytics()
  analytics.trackOnboardingStart()
  expect(analyticsMock.logTutorialBegin).toBeCalledTimes(1)
})

it('tracks OnboardingEnd', () => {
  const { analytics } = givenAnalytics()
  analytics.trackOnboardingEnd()
  expect(analyticsMock.logTutorialComplete).toBeCalledTimes(1)
})

it('tracks SignIn', () => {
  const { analytics } = givenAnalytics()
  analytics.trackSignIn()
  expect(analyticsMock.logLogin).toBeCalledTimes(1)
})

it('tracks SignUp', () => {
  const { analytics } = givenAnalytics()
  analytics.trackSignUp()
  expect(analyticsMock.logSignUp).toBeCalledTimes(1)
})

it('tracks SignOut', () => {
  const { analytics } = givenAnalytics()
  analytics.trackSignOut()
  expect(analyticsMock.logEvent).toBeCalledTimes(1)
  expect(analyticsMock.logEvent).toBeCalledWith('sign_out')
})

it('tracks Search', () => {
  const { analytics } = givenAnalytics()
  analytics.trackSearch()
  expect(analyticsMock.logSearch).toBeCalledTimes(1)
})

it('tracks SelectPost', () => {
  const { analytics } = givenAnalytics()
  analytics.trackSelectPost()
  expect(analyticsMock.logSelectContent).toBeCalledTimes(1)
})

it('tracks ReceiveIntent', () => {
  const { analytics } = givenAnalytics()
  analytics.trackReceiveIntent()
  expect(analyticsMock.logShare).toBeCalledTimes(1)
})
