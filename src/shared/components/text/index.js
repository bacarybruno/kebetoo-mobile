import React from 'react'
import { Text as RNText } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'

import styles from './styles'

export const fontSizes = {
  tiny: 10,
  xs: 12,
  sm: 14,
  md: 16,
  header: 20,
  lg: 24,
  xl: 27,
}
const Text = ({
  text = '',
  children,
  size = 'md',
  bold = false,
  style = {},
  color = 'black',
  opacity = 1,
  fontSize = null,
  uppercase,
  textDecorationLine = 'none',
  ...props
}) => (
  <RNText
    style={[
      styles.wrapper,
      {
        fontSize: fontSize || fontSizes[size],
        fontWeight: bold ? 'bold' : 'normal',
        color: colors[color],
        opacity,
        textDecorationLine,
      },
      style,
    ]}
    {...props}
  >
    {uppercase ? text.toUpperCase() : text}
    {children}
  </RNText>
)

export const ThemedText = (props) => (
  <Text color="black" {...props} />
)

export default Text
