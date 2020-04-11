import 'react-native-gesture-handler'
import './config/strings'

import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'
import RootContainer from './packages/app/containers'

export default () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <SafeAreaProvider>
        <RootContainer />
      </SafeAreaProvider>
    </PersistGate>
  </Provider>
)
