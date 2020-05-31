import { useCallback, useState } from 'react'
import ImagePicker from 'react-native-image-picker'
import dayjs from 'dayjs'
import RNFetchBlob from 'rn-fetch-blob'

import * as api from 'Kebetoo/src/shared/helpers/http'

const PICTURE_CONFIG = Object.freeze({
  mediaType: 'photo',
  noData: true,
  allowsEditing: true,
  quality: 0.8,
  maxHeight: 800,
})
export const constructFileName = (time) => (
  `IMG-${time}`
)

const useFilePicker = () => {
  const [file, setFile] = useState(null)
  const pickImage = useCallback(() => {
    ImagePicker.launchImageLibrary(PICTURE_CONFIG, (res) => {
      if (res.uri) {
        setFile(res)
      }
    })
  }, [])

  const reset = useCallback(async () => {
    if (file) {
      await RNFetchBlob.fs.unlink(file.path)
      setFile(null)
    }
  }, [file])

  const savePost = useCallback(async (author, content) => {
    const time = dayjs().format('YYYYMMDD')
    const response = await api.createPostWithImage({
      author,
      content,
      image: {
        uri: file.uri,
        mimeType: file.type,
        name: constructFileName(time),
      },
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
