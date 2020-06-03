import 'react-native-gesture-handler'
import './config/strings'
import './config/init'
// import './config/wdyr'

import React from 'react'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'

import RootContainer from './packages/app/containers'
import { store, persistor } from './redux/store'

const App = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <SafeAreaProvider>
        <ActionSheetProvider>
          <RootContainer />
        </ActionSheetProvider>
      </SafeAreaProvider>
    </PersistGate>
  </Provider>
)

export default App
