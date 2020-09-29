const { PERMISSIONS, RESULTS } = require('react-native-permissions/lib/commonjs/constants.js')

export { PERMISSIONS, RESULTS }

export const request = jest.fn().mockResolvedValue(RESULTS.GRANTED)
export const check = jest.fn().mockResolvedValue(RESULTS.GRANTED)
