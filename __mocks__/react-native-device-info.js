const getBrand = jest.fn().mockReturnValue('Huawei')
const getModel = jest.fn().mockReturnValue('P30 Lite')
const getDeviceType = jest.fn().mockReturnValue('Phone')
const getSystemName = jest.fn().mockReturnValue('Android')
const getSystemVersion = jest.fn().mockReturnValue(10)

export default {
  getBrand,
  getModel,
  getDeviceType,
  getSystemName,
  getSystemVersion,
}
