import { useCallback } from 'react'
import auth from '@react-native-firebase/auth'
import { useDispatch, useSelector } from 'react-redux'

import { userProfileSelector } from '@app/redux/selectors'
import { SET_USER_PROFILE } from '@app/redux/types'
import routes from '@app/navigation/routes'

import { api } from '../services'
import useBottomSheet from './bottom-sheet'
// import useAnalytics from './analytics'

const useUser = () => {
  // const { trackSignOut } = useAnalytics()
  const profile = useSelector(userProfileSelector)
  const { isLoggedIn } = profile
  const dispatch = useDispatch()
  const { showAvatarOptions: showUserAvatarOptions } = useBottomSheet()

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
    // eslint-disable-next-line no-underscore-dangle
    await api.assets.delete(currentPicture[0]._id)
    await api.authors.update(profile.uid, { photoURL })
  }, [dispatch, profile])

  const deleteProfilePicture = useCallback(async () => updateProfilePicture(''), [updateProfilePicture])

  const showAvatarOptions = useCallback(async ({ onLoading, navigate, saveImage }) => {
    try {
      onLoading(true)
      const actionIndex = await showUserAvatarOptions()
      if (actionIndex === 0) {
        const profilePictureUrl = await saveImage()
        await updateProfilePicture(profilePictureUrl)
      } else if (actionIndex === 1) {
        if (profile.photoURL) {
          await deleteProfilePicture()
        }
      } else if (actionIndex === 2) {
        if (profile.photoURL) {
          navigate(routes.MODAL_IMAGE, {
            source: { uri: profile.photoURL },
          })
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      onLoading(false)
    }
  }, [showUserAvatarOptions, updateProfilePicture, profile.photoURL, deleteProfilePicture])

  return {
    signOut,
    profile,
    isLoggedIn,
    showAvatarOptions,
    updateProfilePicture,
    deleteProfilePicture,
  }
}

export default useUser
