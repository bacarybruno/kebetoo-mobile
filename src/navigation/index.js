import React, { useState, useEffect } from 'react'
import { enableScreens } from 'react-native-screens'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import auth from '@react-native-firebase/auth'

import NavBackButton from 'Kebetoo/src/shared/components/buttons/nav-back'
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

import styles from './styles'
import routes from './routes'

enableScreens()
const Stack = createStackNavigator()
const defaultScreenOptions = {
  headerLeft: NavBackButton,
  headerStyle: styles.headerStyle,
  headerTitleAlign: 'center',
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

export const HomeStack = () => (
  <Stack.Navigator screenOptions={defaultScreenOptions}>
    <Stack.Screen
      name={routes.HOME}
      component={HomePage}
      options={homeRouteOptions}
    />
  </Stack.Navigator>
)

export default () => {
  const initialUserState = auth().currentUser !== null
  const [isLoggedIn, setIsLoggedIn] = useState(initialUserState)

  useEffect(() => {
    const onAuthStateChanged = (user) => {
      setIsLoggedIn(!!user)
    }
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  })

  return (
    <NavigationContainer>
      {isLoggedIn ? <HomeStack /> : <OnboardingStack />}
    </NavigationContainer>
  )
}
