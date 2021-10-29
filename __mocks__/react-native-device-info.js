export const getBrand = jest.fn().mockReturnValue('Huawei');
export const getModel = jest.fn().mockReturnValue('P30 Lite');
export const getDeviceType = jest.fn().mockReturnValue('Phone');
export const getSystemName = jest.fn().mockReturnValue('Android');
export const getSystemVersion = jest.fn().mockReturnValue(10);
export const getVersion = jest.fn().mockReturnValue('0.0.8');
export const getApplicationName = jest.fn().mockReturnValue('Kebetoo');
export const hasNotch = jest.fn().mockReturnValue(false);

module.exports = {
  getBrand,
  getModel,
  getDeviceType,
  getSystemName,
  getSystemVersion,
  getVersion,
  getApplicationName,
  hasNotch,
};
