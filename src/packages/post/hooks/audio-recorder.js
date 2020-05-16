import {
  useState, useEffect, useCallback, useRef,
} from 'react'
import { Recorder, Player } from '@react-native-community/audio-toolkit'
import RNFetchBlob from 'rn-fetch-blob'
import * as api from 'Kebetoo/src/shared/helpers/http'

import { usePermissions } from 'Kebetoo/src/shared/hooks'

export const MAX_DURATION_IN_SECONDS = 30
export const RECORD_NAME = 'kebetoo-record.aac'
export const RECORD_MIME_TYPE = 'audio/aac'

export const getUri = (filename = RECORD_NAME) => (
  `${RNFetchBlob.fs.dirs.DocumentDir}/${filename}`
)

const useAudioRecorder = (maxDuration) => {
  const maxDurationInSeconds = maxDuration || MAX_DURATION_IN_SECONDS
  const [isRecording, setIsRecording] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const intervalRef = useRef()
  const permissions = usePermissions()
  const [recorder, setRecorder] = useState(null)

  const start = useCallback(async () => {
    const hasPermissions = await permissions.recordAudio()
    if (hasPermissions) {
      setElapsedTime(0)
      setRecorder(new Recorder(RECORD_NAME, {
        bitrate: 32000,
        sampleRate: 32000,
        channels: 1,
        quality: 'min',
      }).record())
      setIsRecording(true)
    }
  }, [permissions])

  const stop = useCallback(async () => {
    setIsRecording(false)
    if (recorder) {
      recorder.stop()
      new Player(RECORD_NAME).play()
      const response = await api.createPostWithAudio({
        author: 'RUCPMUzpttYRz43Qw29Xeg0Lk592',
        content: 'Hello first audio from code',
        audio: {
          uri: getUri(),
          type: RECORD_MIME_TYPE,
          name: 'hello-world',
        },
      })
      console.log('create post with audio success', response)
      await RNFetchBlob.fs.unlink(getUri())
    }
  }, [recorder])

  useEffect(() => {
    if (isRecording && !intervalRef.current) {
      const timeStart = Date.now()
      intervalRef.current = setInterval(() => {
        const delta = Date.now() - timeStart
        setElapsedTime(Math.floor(delta / 1000))
      }, 100)
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
    isRecording,
    elapsedTime,
  }
}

export default useAudioRecorder
