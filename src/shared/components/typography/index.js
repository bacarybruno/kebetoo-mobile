import React from 'react'
import { Text } from 'react-native'
import { human, systemWeights, material } from 'react-native-typography'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { useAppColors } from '@app/shared/hooks'

const weights = {
  thin: 'thin',
  light: 'light',
  regular: 'regular',
  semibold: 'semibold',
  bold: 'bold',
}

const colors = {
  primary: 'textPrimary',
  secondary: 'textSecondary',
  tertiary: 'textTertiary',
  link: 'link',
  white: 'white',
}

const fontSizes = {
  tiny: 10,
  xs: 12,
  sm: 14,
  md: 16,
  header: 20,
  lg: 24,
  xl: 27,
}

const types = {
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
  children, style, size, ...otherProps
}) => (
  <Text
    style={[
      size <= 3 && human[`title${size}`],
      size === 4 && human.headline,
      size === 5 && human.subhead,
      size === 6 && human.caption1,
      style,
    ]}
    {...otherProps}
  >
    {children}
  </Text>
)

const Subheading = ({ children, style, ...otherProps }) => (
  <Text style={[human.body, style]} {...otherProps}>
    {children}
  </Text>
)

const Button = ({ children, style, ...otherProps }) => (
  <Text style={[human.calloutWhite, style]} {...otherProps}>
    {children}
  </Text>
)

const Separator = ({ children, style, ...otherProps }) => (
  <Text style={[material.body2, style]} {...otherProps}>
    {children}
  </Text>
)

const TextButton = ({
  children, style, onPress, ...otherProps
}) => (
  <Text style={[human.callout, style]} onPress={onPress} {...otherProps}>
    {children}
  </Text>
)

const Body = ({ children, style, ...otherProps }) => (
  <Text style={[human.subhead, style]} {...otherProps}>
    {children}
  </Text>
)

const Caption = ({ children, style, ...otherProps }) => (
  <Text style={[human.caption1, style]} {...otherProps}>
    {children}
  </Text>
)

const createTypography = (
  text, style, color, onPress, themeColors, hasBadge, defaultProps,
) => (Baseline, props) => {
  const { systemWeight = weights.regular, systemColor = colors.primary, ...textProps } = {
    ...props,
    ...defaultProps,
  }
  return (
    <Baseline
      style={[
        { color: themeColors[color || systemColor] },
        systemWeights[systemWeight],
        style,
      ]}
      onPress={onPress}
      {...textProps}
    >
      {text}
      {hasBadge && (
        <>
          <Ionicon name="shield-checkmark" size={16} color={themeColors.primary} />
          <Text>{' '}</Text>
        </>
      )}
    </Baseline>
  )
}

const Typography = ({
  type = types.body, text, style, color, onPress, hasBadge, ...otherProps
}) => {
  const { colors: themeColors } = useAppColors()

  if (text === null || text === undefined) return null

  const typography = createTypography(text, style, color, onPress, themeColors, hasBadge, otherProps)

  switch (type) {
    case types.headline1:
      return typography(Headline, {
        size: 1,
        systemWeight: weights.semibold,
      })
    case types.headline2:
      return typography(Headline, {
        size: 2,
        systemWeight: weights.semibold,
      })
    case types.headline3:
      return typography(Headline, {
        size: 3,
        systemWeight: weights.semibold,
      })
    case types.headline4:
      return typography(Headline, {
        size: 4,
      })
    case types.headline5:
      return typography(Headline, {
        size: 5,
      })
    case types.headline6:
      return typography(Headline, {
        size: 6,
        systemColor: colors.secondary,
      })
    case types.subheading:
      return typography(Subheading)
    case types.button:
      return typography(Button, {
        systemColor: colors.white,
        systemWeight: weights.semibold,
      })
    case types.separator:
      return typography(Separator, {
        systemWeight: weights.regular,
      })
    case types.textButton:
      return typography(TextButton)
    case types.textButtonLight:
      return typography(TextButton, {
        systemWeight: weights.light,
      })
    case types.body:
      return typography(Body)
    case types.caption:
      return typography(Caption)
    default:
      return null
  }
}

Typography.types = types
Typography.colors = colors
Typography.weights = weights
Typography.fontSizes = fontSizes

export default Typography
