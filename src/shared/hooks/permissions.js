import { useCallback } from 'react'
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions'
import { Platform } from 'react-native'

const usePermissions = () => {
  const handlePermissions = useCallback(async (name) => {
    const requestPermissionResult = await request(name)
    return requestPermissionResult === RESULTS.GRANTED
  }, [])

  const recordAudio = useCallback(async () => {
    const audioPermissionName = Platform.select({
      ios: PERMISSIONS.IOS.MICROPHONE,
      android: PERMISSIONS.ANDROID.RECORD_AUDIO,
    })
    const hasPermissions = await handlePermissions(audioPermissionName)
    return hasPermissions
  }, [handlePermissions])

  return {
    recordAudio,
  }
}

export default usePermissions
