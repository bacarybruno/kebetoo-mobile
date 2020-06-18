/* eslint-disable no-bitwise */

const componentToHex = (c) => {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex
}

const rgbToHex = (r, g, b) => `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`

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

export const middleHexColorsToRgb = (color1, color2) => {
  const [r1, g1, b1] = hexToRgb(color1)
  const [r2, g2, b2] = hexToRgb(color2)
  const r = (r1 + r2) / 2
  const g = (g1 + g2) / 2
  const b = (b1 + b2) / 2
  return [r, g, b]
}

const iconColors = {
  like: '#004EEC',
  dislike: '#0B1B77',
  heart: '#E74F65',
  reactions: '#50555C',
}

const colors = {
  primary: '#004EEC',
  secondary: '#00CEFC',
  black: 'rgba(0, 0, 0, 0.8)',
  inactive: '#CECECE',
  white: '#FFFFFF',
  grey: '#707070',
  background: '#FFFFFF',
  input: '#F2F2F2',
  white_darken: '#FAFAFA',
  icon: '#7A8FA6',
  purple: '#874FB1',
  blue_dark: '#0B1B77',
  facebook: '#3b5998',
  danger: '#d32f2f',
  placeholder: '#ACACAC',
  border: '#E8E8E8',
  ...iconColors,
}

export const middleColor = rgbToHex(
  ...middleHexColorsToRgb(colors.primary, colors.secondary),
)

colors.primary = middleColor
colors.secondary = middleColor

export default colors
