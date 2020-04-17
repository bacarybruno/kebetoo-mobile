import 'react-native-gesture-handler'
import './config/strings'
import './config/init'

import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'

import RootContainer from './packages/app/containers'
import { store, persistor } from './redux/store'

export default () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <SafeAreaProvider>
        <RootContainer />
      </SafeAreaProvider>
    </PersistGate>
  </Provider>
)
