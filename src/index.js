import React from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'
import NavigationContainer from './navigation'

export default () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <NavigationContainer />
    </PersistGate>
  </Provider>
)
