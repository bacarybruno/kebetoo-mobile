/* eslint-disable no-bitwise */

const colors = {
  primary: '#7581DE',
  secondary: '#EB79A0',
  black: '#242424',
  inactive: '#CECECE',
  white: '#FFFFFF',
  grey: '#707070',
  background: '#FFFFFF',
  input: '#F2F2F2',
  white_darken: '#FAFAFA',
  icon: '#7A8FA6',
  purple: '#874FB1',
  blue_dark: '#322153',
  facebook: '#3b5998',
  danger: '#d32f2f',
}

export const hexToRgb = (hex) => {
  const sanitizedHex = hex.replace('#', '')
  const bigint = parseInt(sanitizedHex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return [r, g, b]
}

export const hexToRgba = (hex, a) => {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export default colors
