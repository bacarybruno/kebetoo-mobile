import React, { useEffect, useCallback, useRef } from 'react'
import { Image, Platform, View } from 'react-native'
import { enableScreens } from 'react-native-screens'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs'
import RNBootSplash from 'react-native-bootsplash'
import messaging from '@react-native-firebase/messaging'
import PushNotification from 'react-native-push-notification'
import AsyncStorage from '@react-native-community/async-storage'
import Ionicon from 'react-native-vector-icons/Ionicons'

import {
  TabBarAddButton, HeaderBack, Typography, CameraRollPicker,
} from '@app/shared/components'
import { images } from '@app/theme'
import OnboardingPage from '@app/features/onboarding/containers'
import SignUpPage from '@app/features/account/containers/signup'
import SignInPage from '@app/features/account/containers/signin'
import HomePage from '@app/features/home/containers'
import RoomsPage from '@app/features/rooms/containers'
import CreateRoomPage from '@app/features/rooms/containers/create'
import RoomPage from '@app/features/rooms/containers/room'
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
const defaultScreenOptions = {
  safeAreaInsets: Platform.select({
    ios: { top: 10, bottom: 0 },
    default: {},
  }),
  gestureEnabled: true,
  ...TransitionPresets.ModalSlideFromBottomIOS,
}

const defaultOnboardingScreenOptions = (styles, colors) => ({
  ...defaultScreenOptions,
  headerBackImage: () => (
    <HeaderBack tintColor={colors.textPrimary} />
  ),
  headerStyle: styles.headerStyle,
  headerTitleAlign: 'center',
  headerBackTitleVisible: false,
  headerTitleStyle: { color: colors.textPrimary },
})

const defaultTabBarOptions = (styles, colors) => ({
  ...defaultScreenOptions,
  activeTintColor: colors.primary,
  inactiveTintColor: colors.icon,
  style: styles.tabBar,
})

const defaultTabOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color }) => {
    const iconNames = {
      [routes.HOME]: 'home',
      [routes.ROOMS]: 'chatbubbles',
      [routes.SEARCH]: 'search',
      [routes.NOTIFICATIONS]: 'notifications',
    }
    const size = 24
    const iconName = iconNames[route.name]
    if (iconName === undefined) return
    return (
      <Ionicon
        name={focused ? iconName : (iconName + '-outline')}
        size={size}
        color={color}
      />
    )
  },
  tabBarLabel: ({ focused, color }) => {
    const labels = {
      [routes.HOME]: HomePage.routeOptions.title,
      [routes.ROOMS]: RoomsPage.routeOptions.title,
      [routes.SEARCH]: SearchPage.routeOptions.title,
      [routes.NOTIFICATIONS]: NotificationsPage.routeOptions.title,
    }
    return (
      <Typography
        type={Typography.types.caption}
        text={labels[route.name]}
        systemWeight={focused ? Typography.weights.bold : undefined}
        numberOfLines={1}
        style={{ color }}
      />
    )
  },
})

const defaultMainScreenOptions = {
  ...defaultScreenOptions,
  headerShown: false,
}

// Pages
export const tabPages = [
  <Tab.Screen name={routes.HOME} component={HomePage} />,
  <Stack.Screen name={routes.NOTIFICATIONS} component={NotificationsPage} />,
  <Tab.Screen name={routes.TABS_FAB} component={EmptyPage} />,
  <Tab.Screen name={routes.ROOMS} component={RoomsPage} />,
  <Tab.Screen name={routes.SEARCH} component={SearchPage} />,
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
      <TabBarAddButton />
      <BottomTabBar {...props} />
    </View>
  </View>
)

export const TabPage = () => {
  const { badgeCount } = useNotifications()
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()
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
  const { colors } = useAppColors()
  return (
    <Stack.Navigator screenOptions={defaultOnboardingScreenOptions(styles, colors)}>
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
  <Stack.Screen component={ProfilePage} name={routes.PROFILE} />,
  <Stack.Screen component={CreateRoomPage} name={routes.CREATE_ROOM} />,
  <Stack.Screen component={RoomPage} name={routes.ROOM} />,
]

// Main Section
const AppNavigation = () => {
  const { isLoggedIn, profile } = useUser()
  const { persistNotification } = useNotifications()
  const { trackPageView } = useAnalytics()
  const navigationRef = useRef()
  const routeNameRef = useRef()

  const { colors } = useAppColors()

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
  }, [handleInitialNotification, persistNotification, profile.uid])

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
      <Stack.Navigator screenOptions={defaultMainScreenOptions}>
        {isLoggedIn && loggedInPages.map(createPage)}
        {!isLoggedIn && notLoggedInPages.map(createPage)}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation
