import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import AsyncStorage from '@react-native-community/async-storage'

import sagas from '../sagas'
import * as types from '../types'
import rootReducer from '../reducers'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const sagaMiddleware = createSagaMiddleware()

const persistedReducer = persistReducer(persistConfig, (state, action) => {
  let ownState = state
  if (action.type === types.LOGOUT) {
    // remote all persisted redux data
    persistConfig.storage.removeItem('persist:root')
    ownState = undefined

    // TODO: consider removing only necessary data
    // ownState.userReducer = undefined
  }
  return rootReducer(ownState, action)
})

export const store = createStore(
  persistedReducer,
  applyMiddleware(sagaMiddleware),
)

sagaMiddleware.run(sagas)

export const persistor = persistStore(store)
