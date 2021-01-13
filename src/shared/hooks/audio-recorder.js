import { useState, useEffect, useCallback } from 'react'
import { Recorder } from '@react-native-community/audio-toolkit'
import RNFetchBlob from 'rn-fetch-blob'
import dayjs from 'dayjs'
import Sound from 'react-native-sound'
import BackgroundTimer from 'react-native-background-timer'
import { LogBox } from 'react-native'

import { api } from '@app/shared/services'
import { usePermissions } from '@app/shared/hooks'
import { getExtension, getMimeType } from '@app/shared/helpers/file'

LogBox.ignoreLogs([
  'Warning: Cannot update a component from inside the function body of a different component.',
])

export const MIN_DURATION_IN_SECONDS = 1
export const MAX_DURATION_IN_SECONDS = 30
export const RECORD_NAME = 'PTT.m4a'
export const RECORD_CONFIG = Object.freeze({
  bitrate: 20000,
  sampleRate: 16000,
  channels: 1,
  quality: 'min',
})
export const constructFileName = (time, duration, extension) => (
  // TODO: check if it's necessary to have unique file names
  `PTT-${time}-${duration}.${extension}`
)
export const extractMetadataFromName = (name) => {
  const extension = getExtension(name)
  const [prefix, time, duration] = name.replace(extension, '').split('-')
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
        name: constructFileName(time, duration || elapsedTime, getExtension(fileUri)),
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
        name: constructFileName(time, elapsedTime, getExtension(fileUri)),
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
    const fileUri = getFileUri()
    await RNFetchBlob.fs.unlink(fileUri)
    setHasRecording(false)
    setElapsedTime(0)
  }, [getFileUri])

  const stop = useCallback(() => {
    BackgroundTimer.stopBackgroundTimer()
    setIsRecording(false)
    if (recorder) {
      recorder.stop(() => {
        if (elapsedTime < minDurationInSeconds) return reset()
        return setHasRecording(true)
      })
    }
  }, [elapsedTime, minDurationInSeconds, recorder, reset])

  useEffect(() => {
    if (isRecording) {
      BackgroundTimer.runBackgroundTimer(() => {
        setElapsedTime((state) => state + 1)
      }, 1000)
    }
    return () => {
      BackgroundTimer.stopBackgroundTimer()
    }
  }, [isRecording])

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
