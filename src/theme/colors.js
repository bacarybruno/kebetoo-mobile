/* eslint-disable no-bitwise */
export default {
  primary: '#7581DE',
  secondary: '#EB79A0',
  black: '#242424',
  inactive: '#CECECE',
  white: '#FFFFFF',
  grey: '#707070',
  background: '#FAFAFA',
  background_darker: '#F5F5F5',
  icon: '#7A8FA6',
  purple: '#874FB1',
  blue_dark: '#322153',
}

export const hexToRgb = (hex) => {
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return [r, g, b]
}
