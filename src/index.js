import './config/strings'
import './config/init'
// import './config/wdyr'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'

import RootContainer from './features/app/containers'
import { store, persistor } from './redux/store'

const App = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ActionSheetProvider>
        <RootContainer />
      </ActionSheetProvider>
    </PersistGate>
  </Provider>
)

export default App
