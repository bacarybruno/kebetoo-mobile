import * as file from '../file'

it('is defined', () => {
  expect(file.getExtension).toBeDefined()
  expect(file.getFileName).toBeDefined()
  expect(file.getMediaType).toBeDefined()
  expect(file.getMimeType).toBeDefined()
  expect(file.isVideo).toBeDefined()
  expect(file.mimeTypes).toBeDefined()
})

test('getMimeType', () => {
  expect(file.getMimeType()).not.toBeDefined()
  expect(file.getMimeType(1)).not.toBeDefined()
  expect(file.getMimeType('')).not.toBeDefined()
  expect(file.getMimeType('.')).not.toBeDefined()
  expect(file.getMimeType('file.mp3')).toBe('audio/mp3')
  expect(file.getMimeType('test/file.png')).toBe('image/png')
})

test('getMediaType', () => {
  expect(file.getMediaType()).not.toBeDefined()
  expect(file.getMediaType(1)).not.toBeDefined()
  expect(file.getMediaType('file.png')).toBe('image')
  expect(file.getMediaType('file.jpg')).toBe('image')
  expect(file.getMediaType('file.mp3')).toBe('audio')
  expect(file.getMediaType('file.opus')).toBe('audio')
  expect(file.getMediaType('file')).toBe(undefined)
})

test('getFileName', () => {
  expect(file.getFileName()).not.toBeDefined()
  expect(file.getFileName(1)).not.toBeDefined()
  expect(file.getFileName('file.png')).toBe('file.png')
  expect(file.getFileName('test/file.jpg')).toBe('file.jpg')
  expect(file.getFileName('test/test/file.mp3')).toBe('file.mp3')
  expect(file.getFileName('//file.opus')).toBe('file.opus')
})

test('getExtension', () => {
  expect(file.getExtension()).not.toBeDefined()
  expect(file.getExtension(1)).not.toBeDefined()
  expect(file.getExtension('file.png')).toBe('png')
  expect(file.getExtension('test/file.jpg')).toBe('jpg')
  expect(file.getExtension('test/test/file.mp3')).toBe('mp3')
  expect(file.getExtension('//file.opus')).toBe('opus')
})

test('isVideo', () => {
  expect(file.isVideo()).toBe(false)
  expect(file.isVideo('file')).toBe(false)
  expect(file.isVideo(null)).toBe(false)
  expect(file.isVideo(false)).toBe(false)
  expect(file.isVideo('file.mp4mp4')).toBe(false)
  expect(file.isVideo('file.mp4')).toBe(true)
})
