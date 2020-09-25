import { act } from 'react-test-renderer'

import firebaseAnalytics from '@react-native-firebase/analytics'
import firebaseCrashlytics from '@react-native-firebase/crashlytics'

import setupTest from '@app/config/jest-setup'

import useAnalytics from '../analytics'

const analyticsMock = firebaseAnalytics()
const crashlyticsMock = firebaseCrashlytics()

beforeEach(jest.clearAllMocks)

/**
 * Analytics events hook
 */
const createAnalytics = async () => {
  const returnVal = {}
  const TestComponent = () => {
    Object.assign(returnVal, useAnalytics(analyticsMock, crashlyticsMock))
    return null
  }
  const givenTestComponent = setupTest(TestComponent)()
  await act(async () => {
    await givenTestComponent()
  })
  return returnVal
}

it('is defined', async () => {
  const analytics = await createAnalytics()
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

it('reports errorasync ', async () => {
  const analytics = await createAnalytics()
  const error = new Error('Something went wrong')
  analytics.reportError(error)
  expect(crashlyticsMock.recordError).toBeCalledTimes(1)
  expect(crashlyticsMock.recordError).toBeCalledWith(error)
})

it('tracks AppOpenasync ', async () => {
  const analytics = await createAnalytics()
  analytics.trackAppOpen()
  expect(analyticsMock.logAppOpen).toBeCalledTimes(1)
})

it('async tracks AppBackground', async () => {
  const analytics = await createAnalytics()
  analytics.trackAppBackground()
  expect(analyticsMock.logEvent).toBeCalledTimes(1)
  expect(analyticsMock.logEvent).toBeCalledWith('app_background')
})

it('tracks PageViewasync ', async () => {
  const analytics = await createAnalytics()
  analytics.trackPageView()
  expect(analyticsMock.logScreenView).toBeCalledTimes(1)
})

it('tracks OnboardingStart', async () => {
  const analytics = await createAnalytics()
  analytics.trackOnboardingStart()
  expect(analyticsMock.logTutorialBegin).toBeCalledTimes(1)
})

it('async tracks OnboardingEnd', async () => {
  const analytics = await createAnalytics()
  analytics.trackOnboardingEnd()
  expect(analyticsMock.logTutorialComplete).toBeCalledTimes(1)
})

it('tracks SignInasync ', async () => {
  const analytics = await createAnalytics()
  analytics.trackSignIn()
  expect(analyticsMock.logLogin).toBeCalledTimes(1)
})

it('tracks SignUpasync ', async () => {
  const analytics = await createAnalytics()
  analytics.trackSignUp()
  expect(analyticsMock.logSignUp).toBeCalledTimes(1)
})

it('tracks SignOutasync ', async () => {
  const analytics = await createAnalytics()
  analytics.trackSignOut()
  expect(analyticsMock.logEvent).toBeCalledTimes(1)
  expect(analyticsMock.logEvent).toBeCalledWith('sign_out')
})

it('tracks Searchasync ', async () => {
  const analytics = await createAnalytics()
  analytics.trackSearch()
  expect(analyticsMock.logSearch).toBeCalledTimes(1)
})

it('tracks async SelectPost', async () => {
  const analytics = await createAnalytics()
  analytics.trackSelectPost()
  expect(analyticsMock.logSelectContent).toBeCalledTimes(1)
})

it('async tracks ReceiveIntent', async () => {
  const analytics = await createAnalytics()
  analytics.trackReceiveIntent()
  expect(analyticsMock.logShare).toBeCalledTimes(1)
})
