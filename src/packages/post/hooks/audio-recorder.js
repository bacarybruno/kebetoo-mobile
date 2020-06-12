import {
  useState, useEffect, useCallback, useRef,
} from 'react'
import { Recorder } from '@react-native-community/audio-toolkit'
import RNFetchBlob from 'rn-fetch-blob'
import dayjs from 'dayjs'

import * as api from 'Kebetoo/src/shared/helpers/http'
import { usePermissions } from 'Kebetoo/src/shared/hooks'
import { getFileName, getMimeType } from 'Kebetoo/src/shared/helpers/file'

export const MIN_DURATION_IN_SECONDS = 1
export const MAX_DURATION_IN_SECONDS = 30
export const RECORD_NAME = 'PTT.aac'
export const RECORD_CONFIG = Object.freeze({
  bitrate: 20000,
  sampleRate: 16000,
  channels: 1,
  quality: 'min',
})
export const constructFileName = (time, duration) => (
  `PTT-${time}-${duration}`
)
export const extractMetadataFromName = (name) => {
  const [prefix, time, duration] = name.split('-')
  return {
    prefix, time, duration,
  }
}
export const getRecordUri = (filename = RECORD_NAME) => (
  `${RNFetchBlob.fs.dirs.DocumentDir}/${filename}`
)

const useAudioRecorder = (uri, maxDuration) => {
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(uri !== undefined)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [recorder, setRecorder] = useState(null)
  const intervalRef = useRef()
  const permissions = usePermissions()
  const maxDurationInSeconds = maxDuration || MAX_DURATION_IN_SECONDS

  const getFileUri = useCallback(() => uri || getRecordUri(), [uri])

  const savePost = useCallback(async (author, content) => {
    const fileUri = getFileUri()
    const time = dayjs().format('YYYYMMDD')
    const response = await api.createPostWithAudio({
      author,
      content,
      audio: {
        uri: fileUri,
        mimeType: getMimeType(fileUri),
        name: uri ? getFileName(uri) : constructFileName(time, elapsedTime),
      },
    })
    setHasRecording(false)
    await RNFetchBlob.fs.unlink(fileUri)
    return response
  }, [elapsedTime, getFileUri, uri])

  const saveComment = useCallback(async (post, author) => {
    const fileUri = getFileUri()
    const time = dayjs().format('YYYYMMDD')
    const response = await api.commentPostWithAudio({
      post,
      author,
      audio: {
        uri: fileUri,
        mimeType: getMimeType(fileUri),
        name: constructFileName(time, elapsedTime),
      },
    })
    setHasRecording(false)
    await RNFetchBlob.fs.unlink(fileUri)
    return response
  }, [elapsedTime, getFileUri])

  const start = useCallback(async () => {
    const hasPermissions = await permissions.recordAudio()
    if (hasPermissions) {
      setRecorder(new Recorder(RECORD_NAME, RECORD_CONFIG).record())
      setIsRecording(true)
    }
  }, [permissions])

  const reset = useCallback(async () => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    const fileUri = getFileUri()
    await RNFetchBlob.fs.unlink(fileUri)
    setHasRecording(false)
    setElapsedTime(0)
  }, [getFileUri])

  const stop = useCallback(() => {
    setIsRecording(false)
    if (recorder) {
      recorder.stop(() => {
        if (elapsedTime < MIN_DURATION_IN_SECONDS) {
          reset()
        } else {
          setHasRecording(true)
        }
      })
    }
  }, [elapsedTime, recorder, reset])

  useEffect(() => {
    if (isRecording && !intervalRef.current) {
      const timeStart = Date.now()
      intervalRef.current = setInterval(() => {
        const delta = Date.now() - timeStart
        setElapsedTime(Math.floor(delta / 1000))
      }, 250)
    }
    return () => {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [isRecording, intervalRef])

  useEffect(() => {
    if (elapsedTime === maxDurationInSeconds) {
      setIsRecording(false)
    }
  }, [elapsedTime, maxDurationInSeconds])

  return {
    start,
    stop,
    savePost,
    saveComment,
    reset,
    isRecording,
    hasRecording,
    elapsedTime,
    recordUri: getFileUri(),
  }
}

export default useAudioRecorder
