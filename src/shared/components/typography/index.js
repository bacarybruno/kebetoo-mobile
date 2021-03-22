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

const styles = {
  [types.headline1]: {
    ...human.title1,
    ...systemWeights[weights.semibold],
  },
  [types.headline2]: {
    ...human.title2,
    ...systemWeights[weights.semibold],
  },
  [types.headline3]: {
    ...human.title3,
    ...systemWeights[weights.semibold],
  },
  [types.headline4]: {
    ...human.headline,
    ...systemWeights[weights.regular],
  },
  [types.headline5]: {
    ...human.subhead,
    ...systemWeights[weights.regular],
  },
  [types.headline6]: {
    ...human.caption1,
    ...systemWeights[weights.regular],
  },
  [types.subheading]: {
    ...human.body,
    ...systemWeights[weights.regular],
  },
  [types.button]: {
    ...human.calloutWhite,
    ...systemWeights[weights.semibold],
  },
  [types.separator]: {
    ...material.body2,
    ...systemWeights[weights.regular],
  },
  [types.textButton]: {
    ...human.callout,
    ...systemWeights[weights.regular],
  },
  [types.textButtonLight]: {
    ...human.callout,
    ...systemWeights[weights.light],
  },
  [types.body]: {
    ...human.subhead,
    ...systemWeights[weights.regular],
  },
  [types.caption]: {
    ...human.caption1,
    ...systemWeights[weights.regular],
  },
}

const Headline = ({
  children, style, size, ...otherProps
}) => {
  return (
    <Text
      style={[
        styles[`headline${size}`],
        style,
      ]}
      {...otherProps}
    >
      {children}
    </Text>
  )
}

const Subheading = ({ children, style, ...otherProps }) => (
  <Text style={[styles.subheading, style]} {...otherProps}>
    {children}
  </Text>
)

const Button = ({ children, style, ...otherProps }) => (
  <Text style={[styles.button, style]} {...otherProps}>
    {children}
  </Text>
)

const Separator = ({ children, style, ...otherProps }) => (
  <Text style={[styles.separator, style]} {...otherProps}>
    {children}
  </Text>
)

const TextButton = ({
  children, style, onPress, ...otherProps
}) => (
  <Text style={[styles.textButton, style]} onPress={onPress} {...otherProps}>
    {children}
  </Text>
)

const TextButtonLight = ({
  children, style, onPress, ...otherProps
}) => (
  <Text style={[styles.textButtonLight, style]} onPress={onPress} {...otherProps}>
    {children}
  </Text>
)

const Body = ({ children, style, ...otherProps }) => (
  <Text style={[styles.body, style]} {...otherProps}>
    {children}
  </Text>
)

const Caption = ({ children, style, ...otherProps }) => (
  <Text style={[styles.caption, style]} {...otherProps}>
    {children}
  </Text>
)

const createTypography = (
  text, style, color, onPress, themeColors, hasBadge, defaultProps,
) => (Baseline, props) => {
  const { systemWeight, systemColor = colors.primary, ...textProps } = {
    ...props,
    ...defaultProps,
  }
  return (
    <Baseline
      style={[
        { color: themeColors[color || systemColor] },
        systemWeight && systemWeights[systemWeight],
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
      return typography(Headline, { size: 1 })
    case types.headline2:
      return typography(Headline, { size: 2 })
    case types.headline3:
      return typography(Headline, { size: 3 })
    case types.headline4:
      return typography(Headline, { size: 4 })
    case types.headline5:
      return typography(Headline, { size: 5 })
    case types.headline6:
      return typography(Headline, { size: 6, systemColor: colors.secondary })
    case types.subheading:
      return typography(Subheading)
    case types.button:
      return typography(Button, { systemColor: colors.white })
    case types.separator:
      return typography(Separator)
    case types.textButton:
      return typography(TextButton)
    case types.textButtonLight:
      return typography(TextButtonLight)
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
Typography.styles = styles

export default Typography
