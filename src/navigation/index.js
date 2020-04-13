import React from 'react'
import { enableScreens } from 'react-native-screens'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import NavBackButton from 'Kebetoo/src/shared/components/buttons/nav-back'
import OnboardingComponent, {
  routeOptions as onboardingRouteOptions,
} from 'Kebetoo/src/packages/onboarding/containers'
import SignUpComponent, {
  routeOptions as signUpRouteOptions,
} from 'Kebetoo/src/packages/account/containers/signup'
import SignInComponent, {
  routeOptions as signInRouteOptions,
} from 'Kebetoo/src/packages/account/containers/signin'

import styles from './styles'
import routes from './routes'

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
        name={routes.ONBOARDING}
        component={OnboardingComponent}
        options={onboardingRouteOptions}
      />
      <Stack.Screen
        name={routes.SIGNUP}
        component={SignUpComponent}
        options={signUpRouteOptions}
      />
      <Stack.Screen
        name={routes.SIGNIN}
        component={SignInComponent}
        options={signInRouteOptions}
      />
    </Stack.Navigator>
  </NavigationContainer>
)
