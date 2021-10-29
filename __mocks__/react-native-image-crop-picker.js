module.exports = {
  openCropper: jest.fn().mockResolvedValue({ path: 'jest://cropped-image.png', mime: 'image/png' }),
  openCamera: jest.fn().mockResolvedValue({ path: 'jest://camera-image.png', mime: 'image/png' }),
};
