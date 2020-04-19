/* eslint-disable no-bitwise */
export default {
  primary: '#7581DE',
  secondary: '#EB79A0',
  black: '#242424',
  inactive: '#CECECE',
  white: '#FFFFFF',
  grey: '#707070',
  grey_lighter: '#E6E6E6',
  background: '#FAFAFA',
  icon: '#7A8FA6',
  purple: '#874FB1',
}

export const hexToRgb = (hex) => {
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return [r, g, b]
}
