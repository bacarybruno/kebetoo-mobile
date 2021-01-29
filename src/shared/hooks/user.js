import { useCallback } from 'react'
import auth from '@react-native-firebase/auth'
import { useDispatch, useSelector } from 'react-redux'

import { userProfileSelector } from '@app/redux/selectors'
import { SET_USER_PROFILE } from '@app/redux/types'

import { api } from '../services'
// import useAnalytics from './analytics'

const useUser = () => {
  // const { trackSignOut } = useAnalytics()
  const profile = useSelector(userProfileSelector)
  const { isLoggedIn } = profile
  const dispatch = useDispatch()

  const signOut = useCallback(async () => {
    try {
      await api.authors.update(profile.uid, { notificationToken: null })
    } catch (error) {
      console.log('An error occured while signing user out', error)
    } finally {
      await auth().signOut()
      // trackSignOut()
    }
  }, [profile.uid])

  const updateProfilePicture = useCallback(async (photoURL) => {
    await auth().currentUser.updateProfile({ photoURL })
    dispatch({ type: SET_USER_PROFILE, payload: { photoURL } })
    const currentPicture = await api.assets.findByUrl(profile.photoURL)
    await api.assets.delete(currentPicture[0]._id)
    await api.authors.update(profile.uid, { photoURL })
  }, [])

  const deleteProfilePicture = useCallback(async () => {
    return updateProfilePicture('')
  }, [updateProfilePicture])

  return {
    signOut,
    profile,
    isLoggedIn,
    updateProfilePicture,
    deleteProfilePicture,
  }
}

export default useUser
