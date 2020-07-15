import { useState, useEffect, useCallback } from 'react'
import auth from '@react-native-firebase/auth'

import { getUserId } from '../helpers/users'

const useUser = () => {
  const authenticatedUser = auth().currentUser
  const [isLoggedIn, setIsLoggedIn] = useState(authenticatedUser !== null)

  const [profile, setProfile] = useState({
    uid: null, displayName: ' ', photoURL: null,
  })

  useEffect(() => {
    const getUserInfos = async () => {
      if (authenticatedUser) {
        const { email, displayName, photoURL } = authenticatedUser
        const userId = await getUserId()
        setProfile({
          uid: userId, displayName, email, photoURL,
        })
      }
    }
    getUserInfos()
  }, [authenticatedUser])

  useEffect(() => {
    const onAuthStateChanged = (user) => setIsLoggedIn(!!user)
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

  const signOut = useCallback(() => auth().signOut(), [])

  return {
    profile,
    signOut,
    isLoggedIn,
  }
}

export default useUser
