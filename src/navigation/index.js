import React, { useEffect, useCallback } from 'react'
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
import TabBarAddButton from '@app/shared/components/buttons/tab-bar'
import { colors, images } from '@app/theme'
import HeaderBack from '@app/shared/components/header-back'
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
import UserProfilePage from '@app/features/profile/containers/user'
import * as api from '@app/shared/helpers/http'

import styles from './styles'
import routes from './routes'
import Typography, { types, weights } from '../shared/components/typography'
import { useUser, useNotifications } from '../shared/hooks'

enableScreens()

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const createPage = (page, key) => React.cloneElement(page, { key })

const EmptyPage = () => null

// Screen options
const defaultScreenOptions = {
  headerBackImage: () => (
    <HeaderBack tintColor={colors.textPrimary} />
  ),
  headerStyle: styles.headerStyle,
  headerTitleAlign: 'center',
  headerTitleStyle: { color: colors.textPrimary },
}

const defaultTabBarOptions = {
  activeTintColor: colors.primary,
  inactiveTintColor: colors.icon,
  style: styles.tabBar,
}

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
        type={types.caption}
        text={labels[route.name]}
        systemWeight={focused ? weights.bold : undefined}
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

export const TabBar = (props) => (
  <View>
    <Image source={images.bottom_tab_overlay} style={styles.bottomTabOverlay} />
    <View>
      <TabBarAddButton route={routes.CREATE_POST} />
      <BottomTabBar {...props} />
    </View>
  </View>
)

export const TabPage = () => {
  const { badgeCount } = useNotifications()

  return (
    <Tab.Navigator
      screenOptions={defaultTabOptions}
      tabBarOptions={defaultTabBarOptions}
      tabBar={TabBar}
    >
      {tabPages.map((page, key) => (
        React.cloneElement(
          page, {
            key,
            options: {
              tabBarBadge: page.props.name === routes.NOTIFICATIONS && badgeCount > 0
                ? badgeCount
                : undefined,
            },
          },
        )
      ))}
    </Tab.Navigator>
  )
}

export const onboardingPages = [
  <Stack.Screen name={routes.ONBOARDING} component={OnboardingPage} />,
  <Stack.Screen name={routes.SIGNUP} component={SignUpPage} />,
  <Stack.Screen name={routes.SIGNIN} component={SignInPage} />,
]

export const OnboardingStack = () => (
  <Stack.Navigator screenOptions={defaultScreenOptions}>
    {onboardingPages.map(createPage)}
  </Stack.Navigator>
)

export const notLoggedInPages = [
  <Stack.Screen component={OnboardingStack} name={routes.ONBARDING_NAV} />,
]

export const loggedInPages = [
  <Stack.Screen component={TabPage} name={routes.HOME_NAV} />,
  <Stack.Screen component={CreatePostPage} name={routes.CREATE_POST} />,
  <Stack.Screen component={CommentsPage} name={routes.COMMENTS} />,
  <Stack.Screen component={ManagePostsPage} name={routes.MANAGE_POSTS} />,
  <Stack.Screen component={ImageModal} name={routes.MODAL_IMAGE} />,
  <Stack.Screen component={UserProfilePage} name={routes.USER_PROFILE} />,
]

// Main Section
const AppNavigation = () => {
  const { isLoggedIn, profile } = useUser()
  const { persistNotification } = useNotifications()

  useEffect(() => {
    RNBootSplash.hide({ duration: 250 })
  }, [])

  const handleInitialNotification = useCallback((remoteMessage) => {
    if (remoteMessage !== null) {
      // do someting
    }
  }, [])

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
        api.updateAuthor(profile.uid, { notificationToken })
      }
    }

    updateUserNotificationId()
    messaging().getInitialNotification().then(handleInitialNotification)
    const unsubscribeForegroundNotification = messaging().onMessage(persistNotification)
    const unsubscribeTokenRefresh = messaging().onTokenRefresh((notificationToken) => {
      api.updateAuthor(profile.uid, { notificationToken })
    })

    return () => {
      unsubscribeForegroundNotification()
      unsubscribeTokenRefresh()
    }
  }, [isLoggedIn, profile.uid, handleInitialNotification, persistNotification])

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn && loggedInPages.map(createPage)}
        {!isLoggedIn && notLoggedInPages.map(createPage)}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation
