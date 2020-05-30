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
import Text from 'Kebetoo/src/shared/components/text'
import HeaderBack from 'Kebetoo/src/shared/components/header-back'
import OnboardingPage, {
  routeOptions as onboardingRouteOptions,
} from 'Kebetoo/src/packages/onboarding/containers'
import SignUpPage, {
  routeOptions as signUpRouteOptions,
} from 'Kebetoo/src/packages/account/containers/signup'
import SignInPage, {
  routeOptions as signInRouteOptions,
} from 'Kebetoo/src/packages/account/containers/signin'
import HomePage, {
  routeOptions as homeRouteOptions,
} from 'Kebetoo/src/packages/home/containers'
import ProfilePage, {
  routeOptions as profileRouteOptions,
} from 'Kebetoo/src/packages/profile/containers'
import SearchPage, {
  routeOptions as searchRouteOptions,
} from 'Kebetoo/src/packages/search/containers'
import StoriesPage, {
  routeOptions as storiesRouteOptions,
} from 'Kebetoo/src/packages/stories/containers'
import CreatePostPage, {
  routeOptions as createPostRouteOptions,
} from 'Kebetoo/src/packages/post/containers/create'
import CommentsPage, {
  routeOptions as commentsRouteOptions,
} from 'Kebetoo/src/packages/comments/containers'
import CommentsOnlinePage, {
  routeOptions as commentsOnlineRouteOptions,
} from 'Kebetoo/src/packages/comments/containers/online'
import ManagePostsPage, {
  routeOptions as managePostsRouteOptions,
} from 'Kebetoo/src/packages/post/containers/manage'

import styles from './styles'
import routes from './routes'

enableScreens()

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const defaultScreenOptions = {
  headerBackImage: ({ tintColor }) => (
    <HeaderBack tintColor={tintColor} />
  ),
  headerStyle: styles.headerStyle,
  headerTitleAlign: 'center',
  headerTitle: (props) => (
    <Text size="header" bold {...props} />
  ),
}

const defaultTabOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color }) => {
    let iconName
    const size = focused ? 24 : 18

    if (route.name === routes.HOME) {
      iconName = 'home'
    } else if (route.name === routes.STORIES) {
      iconName = 'stories'
    } else if (route.name === routes.SEARCH) {
      iconName = 'search'
    } else if (route.name === routes.PROFILE) {
      iconName = 'user'
    }

    return <Kebeticon name={iconName} size={size} color={color} />
  },
  tabBarLabel: ({ focused, color }) => {
    let label

    if (route.name === routes.HOME) {
      label = homeRouteOptions.title
    } else if (route.name === routes.STORIES) {
      label = storiesRouteOptions.title
    } else if (route.name === routes.SEARCH) {
      label = searchRouteOptions.title
    } else if (route.name === routes.PROFILE) {
      label = profileRouteOptions.title
    }

    return (
      <Text text={label} bold={focused} style={{ color }} size="xs" />
    )
  },
})

const defaultTabBarOptions = {
  activeTintColor: colors.primary,
  inactiveTintColor: colors.icon,
  style: styles.tabBar,
}

export const OnboardingStack = () => (
  <Stack.Navigator screenOptions={defaultScreenOptions}>
    <Stack.Screen
      name={routes.ONBOARDING}
      component={OnboardingPage}
      options={onboardingRouteOptions}
    />
    <Stack.Screen
      name={routes.SIGNUP}
      component={SignUpPage}
      options={signUpRouteOptions}
    />
    <Stack.Screen
      name={routes.SIGNIN}
      component={SignInPage}
      options={signInRouteOptions}
    />
  </Stack.Navigator>
)

export const Empty = () => null

export const TabBar = (props) => (
  <View>
    <Image source={images.bottom_tab_overlay} style={styles.bottomTabOverlay} />
    <View>
      <TabBarAddButton route={routes.CREATE_POST} />
      <BottomTabBar {...props} />
    </View>
  </View>
)

const Placeholder = () => <View style={{ flex: 1 }} />

export const TabPage = () => (
  <Tab.Navigator
    screenOptions={defaultTabOptions}
    tabBarOptions={defaultTabBarOptions}
    tabBar={TabBar}
  >
    <Tab.Screen
      name={routes.HOME}
      component={HomePage}
      options={homeRouteOptions}
    />
    <Tab.Screen
      name={routes.STORIES}
      component={StoriesPage}
      options={storiesRouteOptions}
    />
    <Tab.Screen
      name={routes.TABS_FAB}
      component={Empty}
      options={{ tabBarButton: Placeholder }}
    />
    <Tab.Screen
      name={routes.SEARCH}
      component={SearchPage}
      options={searchRouteOptions}
    />
    <Tab.Screen
      name={routes.PROFILE}
      component={ProfilePage}
      options={profileRouteOptions}
    />
  </Tab.Navigator>
)

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
        {isLoggedIn ? (
          <>
            <Stack.Screen
              component={TabPage}
              name={routes.HOME_NAV}
            />
            <Stack.Screen
              options={createPostRouteOptions}
              component={CreatePostPage}
              name={routes.CREATE_POST}
            />
            <Stack.Screen
              options={commentsRouteOptions}
              component={CommentsPage}
              name={routes.COMMENTS}
            />
            <Stack.Screen
              options={commentsOnlineRouteOptions}
              component={CommentsOnlinePage}
              name={routes.COMMENTS_ONLINE}
            />
            <Stack.Screen
              options={managePostsRouteOptions}
              component={ManagePostsPage}
              name={routes.MANAGE_POSTS}
            />
          </>
        ) : (
          <Stack.Screen component={OnboardingStack} name={routes.ONBARDING_NAV} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation
