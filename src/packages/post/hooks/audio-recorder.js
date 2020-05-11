import {
  useState, useEffect, useCallback, useRef,
} from 'react'
import { Recorder, Player } from '@react-native-community/audio-toolkit'

import { usePermissions } from 'Kebetoo/src/shared/hooks'

export const MAX_DURATION_IN_SECONDS = 30
export const RECORD_NAME = 'kebetoo-record.aac'

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
      setRecorder(new Recorder(RECORD_NAME).record())
      setIsRecording(true)
    }
  }, [permissions])

  const stop = useCallback(() => {
    recorder.stop()
    new Player(RECORD_NAME).play()
    setIsRecording(false)
  }, [recorder])

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((value) => value + 1)
      }, 1000)
    } else {
      clearTimeout(intervalRef.current)
      setElapsedTime(0)
      intervalRef.current = null
    }
    return () => clearInterval(intervalRef.current)
  }, [isRecording])

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
