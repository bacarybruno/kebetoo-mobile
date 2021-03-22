import React from 'react'
import setupTest from '@app/config/jest-setup'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import ParsedTypography from '../index'

const Stack = createStackNavigator()
const ParsedTypographyNavigation = (ownProps) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="jest">
        {(props) => <ParsedTypography {...ownProps} {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
)

const givenParsedTypography = setupTest(ParsedTypographyNavigation)({
  text: `
    Hello World!
    Here is a *bold* text 
    Here is a _italic_ italic 
    Here is a ~strikeThrough~ text 
    Made with love by @bacary
    #kebetoo
  `,
  numberOfLines: 2,
})

it('renders ParsedTypography', () => {
  const { wrapper } = givenParsedTypography()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
