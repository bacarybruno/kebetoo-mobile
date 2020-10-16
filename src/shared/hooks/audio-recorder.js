import {
  useState, useEffect, useCallback, useRef,
} from 'react'
import { Recorder } from '@react-native-community/audio-toolkit'
import RNFetchBlob from 'rn-fetch-blob'
import dayjs from 'dayjs'
import Sound from 'react-native-sound'

import { api } from '@app/shared/services'
import { usePermissions } from '@app/shared/hooks'
import { getMimeType } from '@app/shared/helpers/file'

export const MIN_DURATION_IN_SECONDS = 1
export const MAX_DURATION_IN_SECONDS = 30
export const RECORD_NAME = 'PTT.mp4'
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

/**
 * Audio Recorder hook
 * @param {String} uri a predefined audio uri
 * @param {Number} minDuration the min duration of the recorded audio
 * @param {Number} maxDuration the max duration of the recorded audio
 */
const useAudioRecorder = (
  uri,
  minDurationInSeconds = MIN_DURATION_IN_SECONDS,
  maxDurationInSeconds = MAX_DURATION_IN_SECONDS,
) => {
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(uri !== undefined)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [recorder, setRecorder] = useState(null)
  const intervalRef = useRef()
  const permissions = usePermissions()

  const getFileUri = useCallback(() => uri || getRecordUri(), [uri])

  const savePost = useCallback(async (author, content, repost) => {
    const fileUri = getFileUri()
    const time = dayjs().format('YYYYMMDD')
    let duration = null
    if (uri) {
      duration = await new Promise((resolve, reject) => {
        const sound = new Sound(uri, undefined, (err) => {
          if (err) reject(err)
          else resolve(Math.round(sound.getDuration()))
        })
      })
    }
    const response = await api.posts.createAudio({
      author,
      content,
      audio: {
        uri: fileUri,
        mimeType: getMimeType(fileUri),
        name: constructFileName(time, duration || elapsedTime),
      },
      repost,
    })
    setHasRecording(false)
    await RNFetchBlob.fs.unlink(fileUri)
    return response
  }, [elapsedTime, getFileUri, uri])

  const saveComment = useCallback(async (post, author, toReply) => {
    const fileUri = getFileUri()
    const time = dayjs().format('YYYYMMDD')
    const response = await api.comments.createAudio({
      post: toReply ? null : post,
      thread: toReply ? toReply.id : null,
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
    const { isNew, success } = await permissions.recordAudio()
    if (isNew || !success) return
    setRecorder(new Recorder(RECORD_NAME, RECORD_CONFIG).record())
    setIsRecording(true)
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
        if (elapsedTime < minDurationInSeconds) {
          reset()
        } else {
          setHasRecording(true)
        }
      })
    }
  }, [elapsedTime, minDurationInSeconds, recorder, reset])

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
    if (elapsedTime >= maxDurationInSeconds) {
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
