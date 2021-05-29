import { cloneElement, useEffect, useCallback, useRef, useContext } from 'react'
import { Image, Platform, View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import RNBootSplash from 'react-native-bootsplash'
import { enableScreens } from 'react-native-screens'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs'
import { PortalProvider, PortalHost } from '@gorhom/portal'

import Kebeticon from '@app/shared/icons/kebeticons'
import { images } from '@app/theme'
import { strings } from '@app/config'
import { SafeAreaContext } from '@app/shared/contexts'
import {
  TabBarAddButton, HeaderBack, Typography, CameraRollPicker,
} from '@app/shared/components'
import {
  useUser, useNotifications, useAnalytics, useAppStyles, useAppColors, useMessaging,
} from '@app/shared/hooks'

import {
  HomePage,
  RoomPage,
  RoomsPage,
  VideoModal,
  ImageModal,
  SignUpPage,
  SignInPage,
  SearchPage,
  StoriesPage,
  ProfilePage,
  CommentsPage,
  LanguagesPage,
  CreatePostPage,
  OnboardingPage,
  CreateRoomPage,
  EditProfilePage,
  ManagePostsPage,
  UserProfilePage,
  NotificationsPage,
} from './pages'

import routes from './routes'
import createThemedStyles from './styles'


enableScreens()

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const createPage = (page, key) => cloneElement(page, {
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
      [routes.STORIES]: 'stories',
      [routes.ROOMS]: 'chatbubble-ellipses',
      [routes.NOTIFICATIONS]: 'notifications',
    }
    const size = 24
    const iconName = iconNames[route.name]
    if (!iconName) return
    if (iconName === 'stories') {
      return (
        <Kebeticon
          name="stories"
          size={size}
          color={color}
        />
      )
    }
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
      [routes.HOME]: strings.tabs.home,
      [routes.STORIES]: strings.tabs.stories,
      [routes.ROOMS]: strings.tabs.rooms,
      [routes.NOTIFICATIONS]: strings.tabs.notifications,
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
  <Tab.Screen name={routes.STORIES} component={StoriesPage} />,
  <Tab.Screen name={routes.TABS_FAB} component={EmptyPage} />,
  <Tab.Screen name={routes.ROOMS} component={RoomsPage} />,
  <Stack.Screen name={routes.NOTIFICATIONS} component={NotificationsPage} />,
]

export const TabBar = (props, styles, colors, tabBarTheme) => {
  let background = colors.colorScheme === 'dark'
    ? images.bottom_tab_overlay_dark
    : images.bottom_tab_overlay

  if (tabBarTheme) {
    background = tabBarTheme === 'dark'
      ? images.bottom_tab_overlay_dark
      : images.bottom_tab_overlay
  }

  return (
    <View>
      <Image
        source={background}
        fadeDuration={0}
        style={styles.bottomTabOverlay}
      />
      <View>
        <TabBarAddButton />
        <BottomTabBar {...props} />
      </View>
    </View>
  )
}

export const TabPage = () => {
  const { badgeCount } = useNotifications()
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()
  const { tabBarTheme } = useContext(SafeAreaContext)

  return (
    <Tab.Navigator
      lazy={false}
      screenOptions={defaultTabOptions}
      tabBarOptions={defaultTabBarOptions(styles, colors)}
      tabBar={(
        (props) => tabBarTheme !== 'hide'
          ? TabBar(props, styles, colors, tabBarTheme)
          : null
      )}
    >
      {tabPages.map((page, key) => (
        cloneElement(page, {
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
  <Stack.Screen component={EditProfilePage} name={routes.EDIT_PROFILE} />,
  <Stack.Screen component={CreateRoomPage} name={routes.CREATE_ROOM} />,
  <Stack.Screen component={RoomPage} name={routes.ROOM} />,
  <Stack.Screen component={LanguagesPage} name={routes.LANGUAGES} />,
  <Stack.Screen component={SearchPage} name={routes.SEARCH} />,
]

// Main Section
// TODO: use sagas
const AppNavigation = () => {
  const { colors } = useAppColors()

  const { isLoggedIn, profile } = useUser()
  const { trackPageView } = useAnalytics()

  const navigationRef = useRef()
  const routeNameRef = useRef()

  const { setupNotifications } = useMessaging(navigationRef)

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
    setupNotifications()
    trackPageView(routes.HOME)
  }, [])

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
    <PortalProvider>
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
      <PortalHost name="bottom-sheet" />
    </PortalProvider>
  )
}

export default AppNavigation
