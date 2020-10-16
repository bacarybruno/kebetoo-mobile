import { useCallback, useState, useEffect } from 'react'
import ImagePicker from 'react-native-image-picker'
import dayjs from 'dayjs'
import RNFetchBlob from 'rn-fetch-blob'

import { api } from '@app/shared/services'
import { getMimeType } from '@app/shared/helpers/file'

const PICTURE_CONFIG = Object.freeze({
  mediaType: 'photo',
  noData: true,
  allowsEditing: true,
  quality: 0.8,
  maxHeight: 800,
})
export const constructFileName = (time) => `IMG-${time}`

const useFilePicker = (uri) => {
  const [file, setFile] = useState(null)

  const pickImage = useCallback(async () => {
    const fileData = await new Promise((resolve) => {
      ImagePicker.launchImageLibrary(PICTURE_CONFIG, (res) => {
        if (res.uri) resolve(res)
        else resolve(false)
      })
    })
    if (fileData) setFile(fileData)
  }, [])

  useEffect(() => {
    if (uri) {
      setFile({
        uri: uri.startsWith('file://') ? uri : `file://${uri}`,
        path: uri,
        type: getMimeType(uri),
      })
    }
  }, [uri])

  const reset = useCallback(async () => {
    if (file) {
      try {
        await RNFetchBlob.fs.unlink(file.path)
      } finally {
        setFile(null)
      }
    }
  }, [file])

  const savePost = useCallback(async (author, content, repost) => {
    const time = dayjs().format('YYYYMMDD')
    const response = await api.posts.createImage({
      author,
      content,
      image: {
        uri: file.uri,
        mimeType: file.type,
        name: constructFileName(time),
      },
      repost,
    })
    await reset()
    return response
  }, [file, reset])

  return {
    pickImage,
    hasFile: file !== null,
    file,
    reset,
    savePost,
  }
}

export default useFilePicker
