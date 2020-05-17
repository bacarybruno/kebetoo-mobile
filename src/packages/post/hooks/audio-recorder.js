import {
  useState, useEffect, useCallback, useRef,
} from 'react'
import { Recorder, Player } from '@react-native-community/audio-toolkit'
import RNFetchBlob from 'rn-fetch-blob'

import * as api from 'Kebetoo/src/shared/helpers/http'
import { usePermissions } from 'Kebetoo/src/shared/hooks'

export const MAX_DURATION_IN_SECONDS = 30
export const RECORD_NAME = 'kebetoo-record.aac'
export const RECORD_MIME_TYPE = 'audio/x-aac'
export const RECORD_CONFIG = Object.freeze({
  bitrate: 32000,
  sampleRate: 22050,
  channels: 1,
  quality: 'min',
})
export const constructFileName = (time, duration) => (
  `record_${time}_${duration}`
)
export const extractMetadataFromName = (name) => {
  const [prefix, time, duration] = name.split('_')
  return {
    prefix, time, duration,
  }
}
export const getRecordUri = (filename = RECORD_NAME) => (
  `${RNFetchBlob.fs.dirs.DocumentDir}/${filename}`
)

const useAudioRecorder = (maxDuration) => {
  const maxDurationInSeconds = maxDuration || MAX_DURATION_IN_SECONDS
  const [isRecording, setIsRecording] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const intervalRef = useRef()
  const permissions = usePermissions()
  const [recorder, setRecorder] = useState(null)

  const save = useCallback(async (author, content) => {
    const fileUri = getRecordUri()
    const time = Date.now()
    const response = await api.createPostWithAudio({
      author,
      content,
      audio: {
        uri: fileUri,
        mimeType: RECORD_MIME_TYPE,
        name: constructFileName(time, elapsedTime),
      },
    })
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

  const stop = useCallback(async () => {
    setIsRecording(false)
    if (recorder) {
      recorder.stop()
      new Player(RECORD_NAME).play()
    }
  }, [recorder])

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
    save,
    isRecording,
    elapsedTime,
  }
}

export default useAudioRecorder
