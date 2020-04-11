import React from 'react'
import { enableScreens } from 'react-native-screens'
import { NavigationContainer } from '@react-navigation/native'
import { Text } from 'react-native'

enableScreens()

export default () => (
  <NavigationContainer>
    <Text>Hello</Text>
  </NavigationContainer>
)
