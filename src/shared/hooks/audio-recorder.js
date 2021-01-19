import { useState, useEffect, useCallback } from 'react'
import { Recorder } from '@react-native-community/audio-toolkit'
import RNFetchBlob from 'rn-fetch-blob'
import dayjs from 'dayjs'
import Sound from 'react-native-sound'
import { Alert, LogBox } from 'react-native'

import { api } from '@app/shared/services'
import { usePermissions } from '@app/shared/hooks'
import { getExtension, getMimeType } from '@app/shared/helpers/file'
import BackgroundTimer from '@app/shared/helpers/background-timer'

LogBox.ignoreLogs([
  'Warning: Cannot update a component from inside the function body of a different component.',
])

export const MIN_DURATION_IN_SECONDS = 1
export const MAX_DURATION_IN_SECONDS = 30
export const RECORD_NAME = 'PTT.aac'
export const RECORD_CONFIG = Object.freeze({
  bitrate: 24000,
  sampleRate: 16000,
  channels: 1,
  quality: 'medium',
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

let recorder = null
let timerId = null

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
  const [recordUri, setRecordUri] = useState(null)
  const permissions = usePermissions()

  const getFileUri = () => uri || recordUri

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
    recorder = new Recorder(RECORD_NAME)
    recorder.prepare((err, path) => {
      // Alert.alert(path)
      if (err) return
      recorder.record()
      setRecordUri(path)
      setIsRecording(true)
    })
  }, [permissions])

  const reset = useCallback(async () => {
    const fileUri = getFileUri()
    await RNFetchBlob.fs.unlink(fileUri)
    setHasRecording(false)
    setElapsedTime(0)
  }, [getFileUri])

  const stop = useCallback(() => {
    BackgroundTimer.clearInterval(timerId)
    timerId = null
    setIsRecording(false)
    if (recorder) {
      recorder.stop(() => {
        if (elapsedTime < minDurationInSeconds) return reset()
        RNFetchBlob.fs
          .cp(recordUri, RNFetchBlob.fs.dirs.DocumentDir + '/' + RECORD_NAME)
          .then(() => {
            setRecordUri(RNFetchBlob.fs.dirs.DocumentDir + '/' + RECORD_NAME)
            setHasRecording(true)
            alert(RNFetchBlob.fs.dirs.DocumentDir + '/' + RECORD_NAME + RECORD_NAME)
          })
      })
    }
  }, [elapsedTime, minDurationInSeconds, recorder, reset])

  useEffect(() => {
    if (isRecording) {
      timerId = BackgroundTimer.setInterval(() => {
        setElapsedTime((state) => state + 1)
      }, 1000)
    }
    return () => {
      BackgroundTimer.clearInterval(timerId)
      timerId = null
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
    recordUri,
  }
}

export default useAudioRecorder
