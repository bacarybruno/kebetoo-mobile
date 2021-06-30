import { utils } from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';

if (utils().isRunningInTestLab) {
  // do not track analytics for firebase test lab
  // used by google play to run test on publish
  analytics().setAnalyticsCollectionEnabled(false);
}
