/* eslint-disable no-bitwise */

import { iOSColors, materialColors } from 'react-native-typography'

// const componentToHex = (c) => {
//   const hex = c.toString(16);
//   return hex.length === 1 ? `0${hex}` : hex
// }

// const rgbToHex = (r, g, b) => `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`

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

// export const middleHexColorsToRgb = (color1, color2) => {
//   const [r1, g1, b1] = hexToRgb(color1)
//   const [r2, g2, b2] = hexToRgb(color2)
//   const r = (r1 + r2) / 2
//   const g = (g1 + g2) / 2
//   const b = (b1 + b2) / 2
//   return [r, g, b]
// }

const iconColors = {
  like: iOSColors.blue,
  dislike: '#0B1B77',
  heart: iOSColors.pink,
  reactions: materialColors.blackSecondary,
}

const colors = {
  primary: iOSColors.blue,
  secondary: iOSColors.blue,
  black: iOSColors.black,
  inactive: iOSColors.lightGray2,
  white: iOSColors.white,
  grey: iOSColors.gray,
  background: iOSColors.white,
  input: '#F2F2F2',
  white_darken: '#FAFAFA',
  icon: '#7A8FA6',
  purple: iOSColors.purple,
  blue_dark: '#0B1B77',
  facebook: '#3b5998',
  danger: iOSColors.red,
  placeholder: '#ACACAC',
  border: iOSColors.lightGray,
  ...iconColors,
}

// export const middleColor = rgbToHex(
//   ...middleHexColorsToRgb(colors.primary, colors.secondary),
// )

export default colors
