import { useCallback, useState, useEffect } from 'react'
import dayjs from 'dayjs'
import RNFetchBlob from 'rn-fetch-blob'
import { useNavigation } from '@react-navigation/native'

import { api } from '@app/shared/services'
import { getMimeType, isVideo } from '@app/shared/helpers/file'
import { CameraRollPicker } from '@app/shared/components'
import routes from '@app/navigation/routes'

export const constructFileName = (time, prefix = 'IMG', duration) => {
  let fileName = `${prefix}-${time}`
  if (duration) {
    fileName = `${fileName}-${duration}`
  }
  return fileName
}

const useFilePicker = (uri) => {
  const [file, setFile] = useState(null)
  const { navigate } = useNavigation()

  const pickImage = useCallback(async () => {
    const fileData = await new Promise((resolve) => {
      navigate(routes.CAMERA_ROLL_PICKER, {
        assetType: CameraRollPicker.AssetTypes.Photos,
        onSelectedItem: (item) => {
          if (item) resolve(item)
          resolve(false)
        },
      })
    })
    if (fileData) setFile(fileData)
  }, [navigate])

  const pickVideo = useCallback(async () => {
    const fileData = await new Promise((resolve) => {
      navigate(routes.CAMERA_ROLL_PICKER, {
        assetType: CameraRollPicker.AssetTypes.Videos,
        onSelectedItem: (item) => {
          resolve(item || false)
        },
      })
    })
    if (fileData) setFile(fileData)
  }, [navigate])

  useEffect(() => {
    if (uri) {
      setFile({
        uri: uri.startsWith('file://') ? uri : `file://${uri}`,
        type: getMimeType(uri),
      })
    }
  }, [uri])

  const reset = useCallback(async () => {
    if (file) {
      try {
        if (!isVideo(file.uri)) {
          await RNFetchBlob.fs.unlink(file.uri)
        }
      } finally {
        setFile(null)
      }
    }
  }, [file])

  const savePost = useCallback(async (author, content, repost) => {
    // TODO: check if it's necessary to have unique file names
    const time = dayjs().format('YYYYMMDD')
    let response
    if (isVideo(file.uri)) {
      response = await api.posts.createVideo({
        author,
        content,
        video: {
          uri: file.uri.replace('file://', ''),
          mimeType: file.type,
          name: constructFileName(time, 'VID', file.duration),
        },
        repost,
      })
    } else {
      response = await api.posts.createImage({
        author,
        content,
        image: {
          uri: file.uri.replace('file://', ''),
          mimeType: file.type,
          name: constructFileName(time, 'IMG'),
        },
        repost,
      })
    }
    await reset()
    return response
  }, [file, reset])

  return {
    pickImage,
    pickVideo,
    hasFile: file !== null,
    type: isVideo(file?.uri) ? 'video' : 'image',
    file,
    reset,
    savePost,
  }
}

export default useFilePicker
