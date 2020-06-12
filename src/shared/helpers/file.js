export const mimeTypes = Object.freeze({
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  mp3: 'audio/mp3',
  aac: 'audio/x-aac',
  mpeg: 'audio/mpeg',
  opus: 'audio/ogg',
  ogg: 'audio/ogg',
  oga: 'audio/ogg',
})

export const getMimeType = (filename) => {
  if (typeof filename !== 'string') return undefined
  const parts = filename.split('.')
  const extension = parts[parts.length - 1]
  return mimeTypes[extension]
}

export const getMediaType = (filename) => {
  if (typeof filename !== 'string') return undefined
  const mimeType = getMimeType(filename)
  if (mimeType === undefined) return undefined
  return mimeType.split('/')[0]
}

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
