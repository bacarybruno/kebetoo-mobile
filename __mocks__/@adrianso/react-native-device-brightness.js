const DeviceBrightness = {
  setBrightnessLevel: jest.fn(),
  getBrightnessLevel: jest.fn().mockResolvedValue(0.5),
  getSystemBrightnessLevel: jest.fn().mockResolvedValue(0.5),
};

export default DeviceBrightness;
