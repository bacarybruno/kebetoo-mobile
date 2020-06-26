import React from 'react'

import Text from 'Kebetoo/src/shared/components/text'
import colors from 'Kebetoo/src/theme/colors'

// custom icons doesn't show up correctly
// so, create a custom mock
export default ({
  name, size, color, style, ...otherProps
}) => (
  <Text
    allowFontScaling={false}
    text={`kebeticon-${name}`}
    fontSize={size}
    color={Object.keys(colors).find((c) => colors[c] === color)}
    style={{
      color,
      fontFamily: 'icomoon',
      fontStyle: 'normal',
      fontWeight: 'normal',
      ...style,
    }}
    {...otherProps}
  />
)
