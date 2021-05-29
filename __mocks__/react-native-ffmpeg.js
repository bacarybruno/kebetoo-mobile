const RNFFmpeg = {
  execute: jest.fn().mockResolvedValue(0),
  executeWithArguments: jest.fn().mockResolvedValue(0),
  executeAsync: jest.fn().mockResolvedValue(0),
}

const RNFFprobe = {
  execute: jest.fn().mockResolvedValue(0),
  executeWithArguments: jest.fn().mockResolvedValue(0),
  executeAsync: jest.fn().mockResolvedValue(0),
}

const RNFFmpegConfig = {
  disableRedirection: jest.fn(),
  disableStatistics: jest.fn(),
  disableLogs: jest.fn(),
}

module.exports = {
  RNFFmpeg,
  RNFFprobe,
  RNFFmpegConfig,
}