import { useState, useEffect, useCallback } from 'react'
import auth from '@react-native-firebase/auth'
import { useDispatch, useSelector } from 'react-redux'

import * as api from '@app/shared/helpers/http'
import { userProfileSelector } from '@app/redux/selectors'
import * as types from '@app/redux/types'

import { getUserId, getUser, setUserId } from '../helpers/users'

const useUser = () => {
  const authenticatedUser = auth().currentUser
  const [isLoggedIn, setIsLoggedIn] = useState(authenticatedUser !== null)

  const profile = useSelector(userProfileSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    const getUserInfos = async () => {
      if (authenticatedUser && !profile.email) {
        const userId = await getUserId()
        const { email, displayName, photoURL } = authenticatedUser
        const userInfos = {
          uid: userId, displayName, email, photoURL,
        }
        dispatch({ type: types.SET_USER_PROFILE, payload: userInfos })
      }
    }

    const refreshUserId = async () => {
      if (!profile.uid && authenticatedUser?.uid) {
        const { id: uid } = await getUser(authenticatedUser.uid)
        await setUserId(uid)
        dispatch({ type: types.SET_USER_PROFILE, payload: { uid } })
      }
    }

    getUserInfos()
    refreshUserId()
  }, [authenticatedUser, profile.uid, profile.email, dispatch])


  useEffect(() => {
    const onAuthStateChanged = (user) => setIsLoggedIn(!!user)
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

  const signOut = useCallback(async () => {
    await api.updateAuthor(profile.uid, { notificationToken: null })
    await auth().signOut()
    dispatch({ type: types.LOGOUT })
  }, [profile.uid, dispatch])

  return {
    profile,
    signOut,
    isLoggedIn,
  }
}

export default useUser
