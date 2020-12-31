import { useCallback } from 'react'
import auth from '@react-native-firebase/auth'
import { useSelector } from 'react-redux'

import { userProfileSelector } from '@app/redux/selectors'

import { api } from '../services'

const useUser = () => {
  const profile = useSelector(userProfileSelector)
  const { isLoggedIn } = profile

  const signOut = useCallback(async () => {
    try {
      await api.authors.update(profile.uid, { notificationToken: null })
    } catch (error) {
      console.log('An error occured while signing user out', error)
    } finally {
      await auth().signOut()
    }
  }, [profile.uid])

  return {
    signOut,
    profile,
    isLoggedIn,
  }
}

export default useUser
