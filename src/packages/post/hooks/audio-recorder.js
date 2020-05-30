import {
  useState, useEffect, useCallback, useRef,
} from 'react'
import { Recorder } from '@react-native-community/audio-toolkit'
import RNFetchBlob from 'rn-fetch-blob'
import dayjs from 'dayjs'

import * as api from 'Kebetoo/src/shared/helpers/http'
import { usePermissions } from 'Kebetoo/src/shared/hooks'

export const MAX_DURATION_IN_SECONDS = 30
export const RECORD_NAME = 'PTT.aac'
export const RECORD_MIME_TYPE = 'audio/x-aac'
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

const useAudioRecorder = (maxDuration) => {
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [recorder, setRecorder] = useState(null)
  const intervalRef = useRef()
  const permissions = usePermissions()
  const maxDurationInSeconds = maxDuration || MAX_DURATION_IN_SECONDS

  const savePost = useCallback(async (author, content) => {
    const fileUri = getRecordUri()
    const time = dayjs().format('YYYYMMDD')
    const response = await api.createPostWithAudio({
      author,
      content,
      audio: {
        uri: fileUri,
        mimeType: RECORD_MIME_TYPE,
        name: constructFileName(time, elapsedTime),
      },
    })
    setHasRecording(false)
    await RNFetchBlob.fs.unlink(fileUri)
    return response
  }, [elapsedTime])

  const saveComment = useCallback(async (post, author) => {
    const fileUri = getRecordUri()
    const time = Date.now()
    const response = await api.commentPostWithAudio({
      post,
      author,
      audio: {
        uri: fileUri,
        mimeType: RECORD_MIME_TYPE,
        name: constructFileName(time, elapsedTime),
      },
    })
    setHasRecording(false)
    await RNFetchBlob.fs.unlink(fileUri)
    return response
  }, [elapsedTime])

  const start = useCallback(async () => {
    const hasPermissions = await permissions.recordAudio()
    if (hasPermissions) {
      setElapsedTime(0)
      setRecorder(new Recorder(RECORD_NAME, RECORD_CONFIG).record())
      setIsRecording(true)
    }
  }, [permissions])

  const stop = useCallback(() => {
    setIsRecording(false)
    if (recorder) {
      recorder.stop()
      setHasRecording(true)
    }
  }, [recorder])

  const reset = useCallback(async () => {
    intervalRef.current = null
    const fileUri = getRecordUri()
    await RNFetchBlob.fs.unlink(fileUri)
    setHasRecording(false)
  }, [])

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
    recordUri: getRecordUri(),
  }
}

export default useAudioRecorder
