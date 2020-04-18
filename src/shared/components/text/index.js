import React from 'react'
import { Text } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'

import styles from './styles'

const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  header: 20,
  lg: 24,
  xl: 27,
}
export default ({
  text,
  children,
  size = 'md',
  bold = false,
  style = {},
  color = 'black',
  ...props
}) => (
  <Text
    style={[
      styles.wrapper,
      {
        fontSize: fontSizes[size],
        fontWeight: bold ? 'bold' : 'normal',
        color: colors[color],
      },
      style,
    ]}
    {...props}
  >
    {text || children}
  </Text>
)
