export const mimeTypes = Object.freeze({
  // images
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  // audio
  mp3: 'audio/mp3',
  m4a: 'audio/mp4',
  aac: 'audio/x-aac',
  opus: 'audio/ogg',
  ogg: 'audio/ogg',
  oga: 'audio/ogg',
  // video
  mov: 'video/quicktime',
  mpg: 'video/mpeg',
  mpeg: 'video/mpeg',
  mp4: 'video/mp4',
  wmv: 'video/x-ms-wmv',
  avi: 'video/x-msvideo',
  webm: 'video/webm',
})

const videoExtensions = Object
  .keys(mimeTypes)
  .filter((mime) => mimeTypes[mime].startsWith('video'))

export const getFileName = (path) => {
  if (typeof path !== 'string') return undefined
  const parts = path.split('/')
  return parts[parts.length - 1]
}

export const getExtension = (filename) => {
  if (typeof filename !== 'string') return undefined
  const parts = filename.split('.')
  return parts[parts.length - 1]
}

export const getMimeType = (filename) => {
  const extension = getExtension(filename)
  return mimeTypes[extension]
}

export const getMediaType = (filename) => {
  const mimeType = getMimeType(filename)
  if (mimeType === undefined) return undefined
  return mimeType.split('/')[0]
}

export const isVideo = (filename) => {
  const extension = getExtension(filename)
  return videoExtensions.includes(extension)
}
