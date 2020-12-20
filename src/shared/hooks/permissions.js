import { useCallback } from 'react'
import { Platform } from 'react-native'
import {
  check, request, PERMISSIONS, RESULTS,
} from 'react-native-permissions'
import messaging from '@react-native-firebase/messaging'

const usePermissions = () => {
  const handlePermissions = useCallback(async (name) => {
    const checkPermissionResult = await check(name)
    const isNew = checkPermissionResult !== RESULTS.GRANTED
    const requestPermissionResult = await request(name)
    return {
      success: requestPermissionResult === RESULTS.GRANTED,
      isNew,
    }
  }, [])

  const recordAudio = useCallback(async () => {
    const audioPermissionName = Platform.select({
      ios: PERMISSIONS.IOS.MICROPHONE,
      android: PERMISSIONS.ANDROID.RECORD_AUDIO,
    })
    const hasPermissions = await handlePermissions(audioPermissionName)
    return hasPermissions
  }, [handlePermissions])

  const notifications = useCallback(async () => {
    const permissionStatus = await messaging().requestPermission()
    const authorizedStatus = [
      messaging.AuthorizationStatus.AUTHORIZED,
      messaging.AuthorizationStatus.PROVISIONAL,
    ]
    return authorizedStatus.includes(permissionStatus)
  }, [])

  const readExternalStorage = useCallback(async () => {
    if (Platform.OS === 'ios') return Promise.resolve(true)
    const hasPermissions = await handlePermissions(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
    return hasPermissions
  }, [handlePermissions])

  return {
    recordAudio,
    notifications,
    readExternalStorage,
  }
}

export default usePermissions
