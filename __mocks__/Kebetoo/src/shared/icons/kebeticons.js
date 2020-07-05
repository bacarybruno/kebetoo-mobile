import React from 'react'
import { Text } from 'react-native'

// custom icons doesn't show up correctly
// so, create a custom mock
export default ({
  name, size, color, style,
}) => (
  <Text
    allowFontScaling={false}
    style={{
      color,
      fontFamily: 'icomoon',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: size,
      ...style,
    }}
    text={`kebeticon-${name}`}
  />
)
