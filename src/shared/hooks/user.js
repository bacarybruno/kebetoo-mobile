import { useCallback } from 'react'
import auth from '@react-native-firebase/auth'
import { useSelector } from 'react-redux'

import { userProfileSelector } from '@app/redux/selectors'

import { api } from '../services'
// import useAnalytics from './analytics'

const useUser = () => {
  // const { trackSignOut } = useAnalytics()
  const profile = useSelector(userProfileSelector)
  const { isLoggedIn } = profile

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

  const updateProfilePicture = useCallback(() => {
    
  }, [])

  return {
    signOut,
    profile,
    isLoggedIn,
  }
}

export default useUser
