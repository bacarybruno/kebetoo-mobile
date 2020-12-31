import { take, call, put } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import auth from '@react-native-firebase/auth'

import * as types from '../../types'

function getAuthChannel() {
  if (!this.authChannel) {
    this.authChannel = eventChannel((emit) => {
      const unsubscribe = auth().onUserChanged((user) => {
        let payload = { isLoggedIn: false }

        if (user) {
          payload = {
            ...payload,
            uid: user.uid,
            isLoggedIn: true,
            email: user.email,
            photoURL: user.photoURL,
            displayName: user.displayName,
            providerUid: user.providerData[0].uid,
            provider: user.providerData[0].providerId,
          }
        }

        if (payload.provider === 'password' && !payload.displayName) {
          // user have been created with email and password
          // but displayName is not yet assigned
          // we wait for the next event that will be assigning displayName to user
          return
        }

        emit({ payload })
      })
      return unsubscribe
    })
  }
  return this.authChannel
}

function* watchForFirebaseAuth() {
  const authChannel = yield call(getAuthChannel)
  try {
    while (true) {
      const { payload } = yield take(authChannel)
      console.log('Received auth event', payload)
      yield put({ type: types.SET_USER_PROFILE_REQUEST, payload })
    }
  } catch (error) {
    console.log('An error occured in auth channel', error)
  } finally {
    console.log('Auth channel terminated gracefully')
  }
}

export default watchForFirebaseAuth
