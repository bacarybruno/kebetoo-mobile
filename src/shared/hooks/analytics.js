import { useEffect, useCallback } from 'react'
import {
  getSystemName, getSystemVersion, getDeviceType, getModel, getBrand,
} from 'react-native-device-info'
import firebaseAnalytics from '@react-native-firebase/analytics'
import firebaseCrashlytics from '@react-native-firebase/crashlytics'

import { useUser } from '@app/shared/hooks'
import { strings } from '@app/config'

import useAppColors from './app-colors'

const Types = {
  POST: 'post',
  RECEIVE_INTENT: 'receive_intent',
}

const analyticsModule = firebaseAnalytics()
const crashlyticsModule = firebaseCrashlytics()

let didSetUserId = false
let didSetUserAttributes = false

const useAnalytics = (analytics = analyticsModule, crashlytics = crashlyticsModule) => {
  const { profile } = useUser()
  const { colors } = useAppColors()

  useEffect(() => {
    const declareUserProperties = async () => {
      if (!didSetUserAttributes) {
        const attributes = {
          brand: `${getBrand()} ${getModel()}`,
          system: `${getSystemName()} ${getSystemVersion()}`,
          type: getDeviceType(),
          locale: strings.getLanguage(),
          theme: colors.colorScheme,
        }
        await analytics.setUserProperties(attributes)
        await crashlytics.setAttributes(attributes)
        didSetUserAttributes = true
      }
    }
    declareUserProperties()
  }, [analytics, colors.colorScheme, crashlytics])

  useEffect(() => {
    const declareUserId = async () => {
      if (!didSetUserId) {
        await analytics.setUserId(profile.uid)
        await crashlytics.setUserId(profile.uid)
        didSetUserId = true
      }
    }
    if (profile.uid) declareUserId()
  }, [analytics, crashlytics, profile.uid])

  // crash reporting
  const reportError = useCallback((error) => crashlytics.recordError(error), [crashlytics])

  // tracking
  const trackOnboardingStart = useCallback(() => analytics.logTutorialBegin(), [analytics])
  const trackOnboardingEnd = useCallback(() => analytics.logTutorialComplete(), [analytics])
  const trackSignIn = useCallback((method) => analytics.logLogin({ method }), [analytics])
  const trackSignUp = useCallback((method) => analytics.logSignUp({ method }), [analytics])
  const trackSignOut = useCallback(() => analytics.logEvent('sign_out'), [analytics])
  const trackAppOpen = useCallback(() => analytics.logAppOpen(), [analytics])
  const trackAppBackground = useCallback(() => analytics.logEvent('background'), [analytics])
  const trackSearch = useCallback((term) => analytics.logSearch({ search_term: term }), [analytics])
  const trackSelectPost = useCallback((id) => (
    analytics.logSelectContent({ content_type: Types.POST, item_id: id })
  ), [analytics])
  const trackReceiveIntent = useCallback((type, item) => (
    analytics.logShare({ content_type: type, method: Types.RECEIVE_INTENT, item_id: item })
  ), [analytics])
  const trackPageView = useCallback((routeName) => (
    analytics.logScreenView({ screen_name: routeName, screen_class: routeName })
  ), [analytics])

  return {
    reportError,
    trackAppOpen,
    trackAppBackground,
    trackPageView,
    trackOnboardingStart,
    trackOnboardingEnd,
    trackSignIn,
    trackSignUp,
    trackSignOut,
    trackSearch,
    trackSelectPost,
    trackReceiveIntent,
  }
}

export default useAnalytics
