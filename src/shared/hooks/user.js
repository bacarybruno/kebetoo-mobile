import { useState, useEffect, useCallback } from 'react'
import auth from '@react-native-firebase/auth'

import * as api from 'Kebetoo/src/shared/helpers/http'

import { getUserId, getUser, setUserId } from '../helpers/users'

// TODO: find out why this hook is looping
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
    const refreshUserId = async () => {
      if (!profile.uid && authenticatedUser?.uid) {
        const user = await getUser(authenticatedUser.uid)
        await setUserId(user.id)
        setProfile((profileState) => ({ ...profileState, uid: user.id }))
      }
    }
    refreshUserId()
  }, [authenticatedUser, profile.uid])

  useEffect(() => {
    const onAuthStateChanged = (user) => setIsLoggedIn(!!user)
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

  const signOut = useCallback(async () => {
    await api.updateAuthor(profile.uid, { notificationToken: null })
    await auth().signOut()
  }, [profile.uid])

  return {
    profile,
    signOut,
    isLoggedIn,
  }
}

export default useUser
