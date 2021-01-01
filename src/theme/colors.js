/* eslint-disable prefer-template */
/* eslint-disable no-bitwise */

import { Appearance } from 'react-native'

import iosColors from './ios-colors'
import mdColors from './md-colors'

const componentToHex = (c) => {
  const hex = c.toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}

export const rgbaToHex = (rgba) => {
  const rgb = rgba.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i)
  return (rgb && rgb.length === 4) ? '#'
    + componentToHex(parseInt(rgb[1], 10)).slice(-2)
    + componentToHex(parseInt(rgb[2], 10)).slice(-2)
    + componentToHex(parseInt(rgb[3], 10)).slice(-2) : rgba
}

export const hexToRgb = (hex) => {
  const sanitizedHex = hex.replace('#', '')
  const bigint = parseInt(sanitizedHex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return [r, g, b]
}

export const hexToRgba = (hex, opacity) => {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// export const rgbToHex = (r, g, b) => (
//   `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
// )

// export const middleHexColorsToRgb = (color1, color2) => {
//   const [r1, g1, b1] = hexToRgb(color1)
//   const [r2, g2, b2] = hexToRgb(color2)
//   const r = (r1 + r2) / 2
//   const g = (g1 + g2) / 2
//   const b = (b1 + b2) / 2
//   return [r, g, b]
// }

// export const middleColor = rgbToHex(
//   ...middleHexColorsToRgb(colors.primary, colors.secondary),
// )

export const createThemeColors = (colorScheme = Appearance.getColorScheme()) => {
  const baseColors = {
    pink: iosColors.systemPink[colorScheme],
    blue: iosColors.systemBlue[colorScheme],
    purple: iosColors.systemPurple[colorScheme],
    red: iosColors.systemRed[colorScheme],
    black: iosColors.black,
    white: iosColors.white,
  }

  const customColors = {
    blue_dark: {
      light: '#0B1B77',
      dark: iosColors.systemGrey.light,
    },
    backgroundSecondary: {
      light: '#F5F5F5',
      dark: iosColors.secondarySystemBackground[colorScheme],
    },
    inactive: {
      light: iosColors.systemGrey3[colorScheme],
      dark: iosColors.inactiveGrey[colorScheme],
    },
    secondary: {
      light: '#F0F6FE',
      dark: iosColors.secondarySystemBackground[colorScheme],
    },
    background: {
      light: iosColors.systemBackground[colorScheme],
      dark: '#121212',
    },
    ripple: {
      dark: 'rgba(255, 255, 255, .32)',
      light: 'rgba(0, 0, 0, .32)',
    },
    onboarding: {
      dark: '#E0F2F8',
      light: '#E0F2F8',
    },
  }

  const iconColors = {
    like: baseColors.blue,
    dislike: baseColors.pink,
    heart: baseColors.pink,
    reactions: mdColors.textSecondary[colorScheme],
    facebook: '#3b5998',
    icon: '#7A8FA6',
  }

  const textColors = {
    textPrimary: mdColors.textPrimary[colorScheme],
    textSecondary: mdColors.textSecondary[colorScheme],
    textTertiary: mdColors.textTertiary[colorScheme],
  }

  const colors = {
    background: customColors.background[colorScheme],
    backgroundSecondary: customColors.backgroundSecondary[colorScheme],
    backgroundTertiary: iosColors.tertiarySystemBackground[colorScheme],

    primary: baseColors.blue,
    secondary: customColors.secondary[colorScheme],
    danger: baseColors.red,
    blue_dark: customColors.blue_dark[colorScheme],

    inactive: customColors.inactive[colorScheme],
    placeholder: iosColors.systemGrey2[colorScheme],
    border: iosColors.systemGrey5[colorScheme],
    link: iosColors.link[colorScheme],

    ripple: customColors.ripple[colorScheme],
    onboarding: customColors.onboarding[colorScheme],

    ...iconColors,
    ...textColors,
    ...baseColors,

    colorScheme,
  }

  return colors
}

export default createThemeColors()
