const res = {
  uri: 'jest://image-picker/file.png',
  path: '/image-picker/file.png',
  type: 'image/png',
}
export default {
  showImagePicker: jest.fn(),
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn().mockImplementation((config, cb) => {
    cb(res)
  }),
}
