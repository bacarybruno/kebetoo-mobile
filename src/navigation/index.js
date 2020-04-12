import React from 'react'
import { enableScreens } from 'react-native-screens'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Onboarding, {
  routeName as OnboardingRouteName,
  routeOptions as OnboardingRouteOptions,
} from '../packages/onboarding/containers'

enableScreens()
const Stack = createStackNavigator()

export default () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        options={OnboardingRouteOptions}
        name={OnboardingRouteName}
        component={Onboarding}
      />
    </Stack.Navigator>
  </NavigationContainer>
)
