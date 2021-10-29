import { AppRegistry } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import '@app/shared/helpers/polyfills';
import '@app/config/notifications';
import '@app/config/firebase';

import { name as appName } from './app.json';
import App from './src';

const HeadlessCheck = ({ isHeadless }) => {
  if (isHeadless) return null;
  return <App />;
};

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(HeadlessCheck));
