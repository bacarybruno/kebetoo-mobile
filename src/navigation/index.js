import React from 'react'
import { enableScreens } from 'react-native-screens'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import NavBackButton from '../packages/shared/components/buttons/nav-back'

import OnboardingComponent, {
  routeName as onboardingRouteName,
  routeOptions as onboardingRouteOptions,
} from '../packages/onboarding/containers'
import SignUpComponent, {
  routeName as signUpRouteName,
  routeOptions as signUpRouteOptions,
} from '../packages/account/containers/signup'
import SignInComponent, {
  routeName as signInRouteName,
  routeOptions as signInRouteOptions,
} from '../packages/account/containers/signin'

import styles from './styles'

enableScreens()
const Stack = createStackNavigator()

export default () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerLeft: NavBackButton,
        headerStyle: styles.headerStyle,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name={onboardingRouteName}
        component={OnboardingComponent}
        options={onboardingRouteOptions}
      />
      <Stack.Screen
        name={signUpRouteName}
        component={SignUpComponent}
        options={signUpRouteOptions}
      />
      <Stack.Screen
        name={signInRouteName}
        component={SignInComponent}
        options={signInRouteOptions}
      />
    </Stack.Navigator>
  </NavigationContainer>
)
