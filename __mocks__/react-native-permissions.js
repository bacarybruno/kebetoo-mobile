const { PERMISSIONS, RESULTS } = require('react-native-permissions/lib/commonjs/constants.js')

export { PERMISSIONS, RESULTS }
// mock out any functions you want in this style...
export const check = async (permission) => jest.fn()
