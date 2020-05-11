import { useState, useEffect, useCallback, useRef } from 'react'

export const MAX_DURATION_IN_SECONDS = 30

const useAudioRecorder = (maxDuration) => {
  const maxDurationInSeconds = maxDuration || MAX_DURATION_IN_SECONDS
  const [isRecording, setIsRecording] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const intervalRef = useRef()

  const start = useCallback(() => {
    setIsRecording(true)
  }, [])

  const stop = useCallback(() => {
    setIsRecording(false)
  }, [])

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((value) => value + 1)
      }, 1000)
      return () => clearInterval(intervalRef.current)
    } else {
      clearTimeout(intervalRef.current)
      setElapsedTime(0)
      intervalRef.current = null
    }
  }, [isRecording])

  useEffect(() => {
    if (elapsedTime === maxDurationInSeconds) {
      setIsRecording(false)
    }
  }, [elapsedTime])

  return {
    start,
    stop,
    isRecording,
    elapsedTime,
  }
}

export default useAudioRecorder
