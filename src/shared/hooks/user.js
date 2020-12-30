import { useState, useEffect, useCallback } from 'react'
import auth from '@react-native-firebase/auth'
import { useDispatch, useSelector } from 'react-redux'

import { api } from '@app/shared/services'
import { userProfileSelector } from '@app/redux/selectors'
import * as types from '@app/redux/types'

import {
  getUserId, getUser, setUserId, clearUserAttributes,
} from '../services/users'

// FIXME: change this implementation to deduplicte instances
// use sagas to orchrestrate auth events
// use same instance of hook or move all the logic in sagas
const useUser = () => {
  const authenticatedUser = auth().currentUser
  const [isLoggedIn, setIsLoggedIn] = useState(authenticatedUser !== null)

  const profile = useSelector(userProfileSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    const getUserInfos = async () => {
      if (authenticatedUser && !profile.email) {
        try {
          const userId = await getUserId()
          const { email, displayName, photoURL } = authenticatedUser
          const userInfos = {
            uid: userId, email, photoURL,
          }
          if (displayName) {
            userInfos.displayName = displayName
          }
          dispatch({ type: types.SET_USER_PROFILE, payload: userInfos })
        } catch (error) {
          console.log('Error while getting user infos', error)
        }
      }
    }

    const refreshUserId = async () => {
      if (!profile.uid && authenticatedUser?.uid) {
        const author = await getUser(authenticatedUser.uid)
        if (!author) {
          // console.log('User not yet created. Retrying in 30s')
          // setTimeout(refreshUserId, 30000)
          return
        }
        await setUserId(author.id)
        dispatch({ type: types.SET_USER_PROFILE, payload: { uid: author.id } })
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
    try {
      await api.authors.update(profile.uid, { notificationToken: null })
      await clearUserAttributes()
    } catch (error) {
      console.log('An error occured when trying to sign user out', error)
    } finally {
      await auth().signOut()
      dispatch({ type: types.LOGOUT })
    }
  }, [profile.uid, dispatch])

  return {
    profile,
    signOut,
    isLoggedIn,
  }
}

export default useUser
