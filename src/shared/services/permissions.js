import { Platform } from 'react-native'
import {
  check, request, PERMISSIONS, RESULTS,
} from 'react-native-permissions'
import messaging from '@react-native-firebase/messaging'

const Permissions = {
  handlePermissions: async (name) => {
    const checkPermissionResult = await check(name)
    const isNew = checkPermissionResult !== RESULTS.GRANTED
    const requestPermissionResult = await request(name)
    return {
      success: requestPermissionResult === RESULTS.GRANTED,
      isNew,
    }
  },

  recordAudio: async () => {
    const audioPermissionName = Platform.select({
      ios: PERMISSIONS.IOS.MICROPHONE,
      android: PERMISSIONS.ANDROID.RECORD_AUDIO,
    })
    const hasPermissions = await Permissions.handlePermissions(audioPermissionName)
    return hasPermissions
  },

  notifications: async () => {
    const permissionStatus = await messaging().requestPermission()
    const authorizedStatus = [
      messaging.AuthorizationStatus.AUTHORIZED,
      messaging.AuthorizationStatus.PROVISIONAL,
    ]
    return authorizedStatus.includes(permissionStatus)
  },

  readExternalStorage: async () => {
    if (Platform.OS === 'ios') return Promise.resolve(true)
    const hasPermissions = await Permissions.handlePermissions(
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    )
    return hasPermissions
  },

  writeExternalStorage: async () => {
    if (Platform.OS === 'ios') return Promise.resolve(true)
    const hasPermissions = await Permissions.handlePermissions(
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    )
    return hasPermissions
  },

  externalStorage: async () => ({
    readExternalStorage: await Permissions.readExternalStorage(),
    writeExternalStorage: await Permissions.writeExternalStorage(),
  }),
}

export default Permissions
