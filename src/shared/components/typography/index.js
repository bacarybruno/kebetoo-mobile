import React from 'react'
import { Text } from 'react-native'

import {
  human, systemWeights, material, materialColors,
} from 'react-native-typography'

import colors from 'Kebetoo/src/theme/colors'

export const fontSizes = {
  tiny: 10,
  xs: 12,
  sm: 14,
  md: 16,
  header: 20,
  lg: 24,
  xl: 27,
}

export const types = {
  headline1: 'headline1',
  headline2: 'headline2',
  headline3: 'headline3',
  headline4: 'headline4',
  headline5: 'headline5',
  headline6: 'headline6',
  subheading: 'subheading',
  button: 'button',
  separator: 'separator',
  textButton: 'textButton',
  textButtonLight: 'textButtonLight',
  body: 'body',
  caption: 'caption',
}

const Headline = ({
  children, style, color, bold, tertiary, secondary, size, ...otherProps
}) => (
  <Text
    style={[
      size <= 3 && human[`title${size}`],
      size === 4 && human.headline,
      size === 5 && human.subhead,
      size === 6 && human.caption1,
      bold ? systemWeights.semibold : systemWeights.regular,
      style,
      secondary && { color: materialColors.blackSecondary },
      tertiary && { color: materialColors.blackTertiary },
      color && { color: colors[color] },
    ]}
    {...otherProps}
  >
    {children}
  </Text>
)

const Subheading = ({
  children, style, color, ...otherProps
}) => (
  <Text style={[human.body, style, color && { color: colors[color] }]} {...otherProps}>
    {children}
  </Text>
)

const Button = ({
  children, style, color, ...otherProps
}) => (
  <Text
    style={[
      human.calloutWhite,
      systemWeights.semibold,
      style,
      color && { color: colors[color] },
    ]}
    {...otherProps}
  >
    {children}
  </Text>
)

const Separator = ({
  children, style, color, ...otherProps
}) => (
  <Text
    style={[
      material.body2,
      systemWeights.regular,
      style,
      color && { color: colors[color] },
    ]}
    {...otherProps}
  >
    {children}
  </Text>
)

const TextButton = ({
  children, style, light, color, onPress, ...otherProps
}) => (
  <Text
    style={[
      human.callout,
      light ? systemWeights.light : systemWeights.regular,
      style,
      color && { color: colors[color] },
    ]}
    onPress={onPress}
    {...otherProps}
  >
    {children}
  </Text>
)

const Body = ({
  children, style, color, ...otherProps
}) => (
  <Text style={[human.subhead, style, color && { color: colors[color] }]} {...otherProps}>
    {children}
  </Text>
)

const Caption = ({
  children, style, color, ...otherProps
}) => (
  <Text style={[human.caption1, style, color && { color: colors[color] }]} {...otherProps}>
    {children}
  </Text>
)

const createTypography = (text, style, color, onPress, otherProps) => (Cmp, props) => (
  <Cmp style={style} color={color} onPress={onPress} {...props} {...otherProps}>{text}</Cmp>
)

const Typography = ({
  type, text, style, color, onPress, ...otherProps
}) => {
  if (!text) return null
  const typography = createTypography(text, style, color, onPress, otherProps)
  switch (type) {
    case types.headline1:
      return typography(Headline, { size: 1 })
    case types.headline2:
      return typography(Headline, { size: 2 })
    case types.headline3:
      return typography(Headline, { size: 3 })
    case types.headline4:
      return typography(Headline, { size: 4, bold: false })
    case types.headline5:
      return typography(Headline, { size: 5, bold: false })
    case types.headline6:
      return typography(Headline, { size: 6, bold: false, secondary: true })
    case types.subheading:
      return typography(Subheading)
    case types.button:
      return typography(Button)
    case types.separator:
      return typography(Separator)
    case types.textButton:
      return typography(TextButton)
    case types.textButtonLight:
      return typography(TextButton, { light: true })
    case types.body:
      return typography(Body)
    case types.caption:
      return typography(Caption)
    default:
      return null
  }
}

export default Typography
