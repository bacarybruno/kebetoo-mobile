import React, { useEffect, useCallback, useRef } from 'react'
import { Image, View } from 'react-native'
import { enableScreens } from 'react-native-screens'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs'
import RNBootSplash from 'react-native-bootsplash'
import messaging from '@react-native-firebase/messaging'
import PushNotification from 'react-native-push-notification'
import AsyncStorage from '@react-native-community/async-storage'
import Ionicon from 'react-native-vector-icons/Ionicons'

import Kebeticon from '@app/shared/icons/kebeticons'
import {
  TabBarAddButton, HeaderBack, Typography, CameraRollPicker,
} from '@app/shared/components'
import { images } from '@app/theme'
import OnboardingPage from '@app/features/onboarding/containers'
import SignUpPage from '@app/features/account/containers/signup'
import SignInPage from '@app/features/account/containers/signin'
import HomePage from '@app/features/home/containers'
import NotificationsPage from '@app/features/notifications/containers'
import ProfilePage from '@app/features/profile/containers'
import SearchPage from '@app/features/search/containers'
import CreatePostPage from '@app/features/post/containers/create'
import CommentsPage from '@app/features/comments/containers'
import ManagePostsPage from '@app/features/post/containers/manage'
import ImageModal from '@app/features/modal/containers/image'
import VideoModal from '@app/features/modal/containers/video'
import UserProfilePage from '@app/features/profile/containers/user'
import { api } from '@app/shared/services'
import {
  useUser, useNotifications, useAnalytics, useAppStyles, useAppColors,
} from '@app/shared/hooks'

import routes from './routes'
import createThemedStyles from './styles'

enableScreens()

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const createPage = (page, key) => React.cloneElement(page, {
  key,
  options: { headerBackTitleVisible: false },
})

const EmptyPage = () => null

// Screen options
const defaultScreenOptions = (styles, colors) => ({
  headerBackImage: () => (
    <HeaderBack tintColor={colors.textPrimary} />
  ),
  headerStyle: styles.headerStyle,
  headerTitleAlign: 'center',
  headerBackTitleVisible: false,
  headerTitleStyle: { color: colors.textPrimary },
})

const defaultTabBarOptions = (styles, colors) => ({
  activeTintColor: colors.primary,
  inactiveTintColor: colors.icon,
  style: styles.tabBar,
})

const defaultTabOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color }) => {
    const iconNames = {
      [routes.HOME]: 'home',
      [routes.NOTIFICATIONS]: 'ios-notifications-outline',
      [routes.SEARCH]: 'search',
      [routes.PROFILE]: 'user',
    }
    const size = focused ? 24 : 18
    const iconName = iconNames[route.name]
    return iconName === 'ios-notifications-outline'
      ? <Ionicon name={iconName} size={size * 1.5} color={color} />
      : <Kebeticon name={iconName} size={size} color={color} />
  },
  tabBarLabel: ({ focused, color }) => {
    const labels = {
      [routes.HOME]: HomePage.routeOptions.title,
      [routes.NOTIFICATIONS]: NotificationsPage.routeOptions.title,
      [routes.SEARCH]: SearchPage.routeOptions.title,
      [routes.PROFILE]: ProfilePage.routeOptions.title,
    }
    return (
      <Typography
        type={Typography.types.caption}
        text={labels[route.name]}
        systemWeight={focused ? Typography.weights.bold : undefined}
        style={{ color }}
      />
    )
  },
})

// Pages
export const tabPages = [
  <Tab.Screen name={routes.HOME} component={HomePage} />,
  <Tab.Screen name={routes.NOTIFICATIONS} component={NotificationsPage} />,
  <Tab.Screen name={routes.TABS_FAB} component={EmptyPage} />,
  <Tab.Screen name={routes.SEARCH} component={SearchPage} />,
  <Tab.Screen name={routes.PROFILE} component={ProfilePage} />,
]

export const TabBar = (styles, colors) => (props) => (
  <View>
    <Image
      source={
        colors.colorScheme === 'dark'
          ? images.bottom_tab_overlay_dark
          : images.bottom_tab_overlay
      }
      fadeDuration={0}
      style={styles.bottomTabOverlay}
    />
    <View>
      <TabBarAddButton route={routes.CREATE_POST} />
      <BottomTabBar {...props} />
    </View>
  </View>
)

export const TabPage = () => {
  const { badgeCount } = useNotifications()
  const styles = useAppStyles(createThemedStyles)
  const colors = useAppColors()
  return (
    <Tab.Navigator
      screenOptions={defaultTabOptions}
      tabBarOptions={defaultTabBarOptions(styles, colors)}
      tabBar={TabBar(styles, colors)}
    >
      {tabPages.map((page, key) => (
        React.cloneElement(page, {
          key,
          options: {
            tabBarBadge: page.props.name === routes.NOTIFICATIONS && badgeCount > 0
              ? badgeCount
              : undefined,
          },
        })
      ))}
    </Tab.Navigator>
  )
}

export const onboardingPages = [
  <Stack.Screen name={routes.ONBOARDING} component={OnboardingPage} />,
  <Stack.Screen name={routes.SIGNUP} component={SignUpPage} />,
  <Stack.Screen name={routes.SIGNIN} component={SignInPage} />,
]

export const OnboardingStack = () => {
  const styles = useAppStyles(createThemedStyles)
  const colors = useAppColors()
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions(styles, colors)}>
      {onboardingPages.map(createPage)}
    </Stack.Navigator>
  )
}

export const notLoggedInPages = [
  <Stack.Screen component={OnboardingStack} name={routes.ONBARDING_NAV} />,
]

export const loggedInPages = [
  <Stack.Screen component={TabPage} name={routes.HOME_NAV} />,
  <Stack.Screen component={CreatePostPage} name={routes.CREATE_POST} />,
  <Stack.Screen component={CommentsPage} name={routes.COMMENTS} />,
  <Stack.Screen component={ManagePostsPage} name={routes.MANAGE_POSTS} />,
  <Stack.Screen component={ImageModal} name={routes.MODAL_IMAGE} />,
  <Stack.Screen component={VideoModal} name={routes.MODAL_VIDEO} />,
  <Stack.Screen component={UserProfilePage} name={routes.USER_PROFILE} />,
  <Stack.Screen component={CameraRollPicker} name={routes.CAMERA_ROLL_PICKER} />,
]

// Main Section
const AppNavigation = () => {
  const { isLoggedIn, profile } = useUser()
  const { persistNotification } = useNotifications()
  const { trackPageView } = useAnalytics()
  const navigationRef = useRef()
  const routeNameRef = useRef()

  const colors = useAppColors()

  const navigationTheme = {
    dark: colors.colorScheme === 'dark',
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.backgroundSecondary,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.pink,
    },
  }

  useEffect(() => {
    RNBootSplash.hide({ fade: true })
    trackPageView(routes.HOME)
  }, [trackPageView])

  const handleInitialNotification = useCallback((remoteMessage) => {
    if (remoteMessage && isLoggedIn) {
      navigationRef.current.navigate(routes.NOTIFICATIONS)
    }
  }, [isLoggedIn])

  useEffect(() => {
    const handleBackgroundNotifications = async () => {
      // save background notifications in redux
      // with a default status of "new"
      const bgNotifications = JSON.parse(await AsyncStorage.getItem('backgroundNotifications')) || []
      bgNotifications.forEach(persistNotification)

      // remove background notifications
      await AsyncStorage.removeItem('backgroundNotifications')
      // reset badge number
      PushNotification.setApplicationIconBadgeNumber(0)
    }

    handleBackgroundNotifications()
  }, [persistNotification])

  useEffect(() => {
    const updateUserNotificationId = async () => {
      const deviceRegistered = messaging().isDeviceRegisteredForRemoteMessages
      if (isLoggedIn && profile.uid && deviceRegistered) {
        const notificationToken = await messaging().getToken()
        api.authors.update(profile.uid, { notificationToken })
      }
    }

    updateUserNotificationId()
    messaging().getInitialNotification().then(handleInitialNotification)
    messaging().onNotificationOpenedApp(handleInitialNotification)
    const unsubscribeForegroundNotification = messaging().onMessage(persistNotification)
    const unsubscribeTokenRefresh = messaging().onTokenRefresh((notificationToken) => {
      api.authors.update(profile.uid, { notificationToken })
    })

    return () => {
      unsubscribeForegroundNotification()
      unsubscribeTokenRefresh()
    }
  }, [isLoggedIn, profile.uid, handleInitialNotification, persistNotification])

  const getCurrentRouteName = () => navigationRef.current.getCurrentRoute().name

  const onNavigationReady = useCallback(() => {
    routeNameRef.current = getCurrentRouteName()
  }, [])

  const onNavigationStateChange = useCallback(() => {
    const previousRouteName = routeNameRef.current
    const currentRouteName = getCurrentRouteName()

    if (previousRouteName !== currentRouteName) {
      trackPageView(currentRouteName)
    }

    routeNameRef.current = currentRouteName
  }, [trackPageView])

  return (
    <NavigationContainer
      ref={navigationRef}
      testRef={navigationRef}
      onReady={onNavigationReady}
      onStateChange={onNavigationStateChange}
      theme={navigationTheme}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn && loggedInPages.map(createPage)}
        {!isLoggedIn && notLoggedInPages.map(createPage)}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation
