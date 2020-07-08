import React, { useState, useEffect } from 'react'
import { Image, View } from 'react-native'
import { enableScreens } from 'react-native-screens'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs'
import auth from '@react-native-firebase/auth'
import RNBootSplash from 'react-native-bootsplash'

import Kebeticon from 'Kebetoo/src/shared/icons/kebeticons'
import TabBarAddButton from 'Kebetoo/src/shared/components/buttons/tab-bar'
import colors from 'Kebetoo/src/theme/colors'
import images from 'Kebetoo/src/theme/images'
import HeaderBack from 'Kebetoo/src/shared/components/header-back'
import OnboardingPage from 'Kebetoo/src/packages/onboarding/containers'
import SignUpPage from 'Kebetoo/src/packages/account/containers/signup'
import SignInPage from 'Kebetoo/src/packages/account/containers/signin'
import HomePage from 'Kebetoo/src/packages/home/containers'
import ProfilePage from 'Kebetoo/src/packages/profile/containers'
import SearchPage from 'Kebetoo/src/packages/search/containers'
import StoriesPage from 'Kebetoo/src/packages/stories/containers'
import CreatePostPage from 'Kebetoo/src/packages/post/containers/create'
import CommentsPage from 'Kebetoo/src/packages/comments/containers'
import ManagePostsPage from 'Kebetoo/src/packages/post/containers/manage'
import ImageModal from 'Kebetoo/src/packages/modal/containers/image'

import styles from './styles'
import routes from './routes'
import Typography, { types, weights } from '../shared/components/typography'

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
      [routes.STORIES]: 'stories',
      [routes.SEARCH]: 'search',
      [routes.PROFILE]: 'user',
    }
    const size = focused ? 24 : 18
    return <Kebeticon name={iconNames[route.name]} size={size} color={color} />
  },
  tabBarLabel: ({ focused, color }) => {
    const labels = {
      [routes.HOME]: HomePage.routeOptions.title,
      [routes.STORIES]: StoriesPage.routeOptions.title,
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
  <Tab.Screen name={routes.STORIES} component={StoriesPage} />,
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

export const TabPage = () => (
  <Tab.Navigator
    screenOptions={defaultTabOptions}
    tabBarOptions={defaultTabBarOptions}
    tabBar={TabBar}
  >
    {tabPages.map(createPage)}
  </Tab.Navigator>
)

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
]

// Main Section
const AppNavigation = () => {
  const initialUserState = auth().currentUser !== null
  const [isLoggedIn, setIsLoggedIn] = useState(initialUserState)

  useEffect(() => {
    RNBootSplash.hide({ duration: 250 })
    const onAuthStateChanged = (user) => setIsLoggedIn(!!user)
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

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
