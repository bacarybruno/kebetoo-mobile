import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';

PushNotification.configure({
  requestPermissions: Platform.OS === 'ios',
});

// TODO: handle in sagas
// handle background notifications
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  if (Platform.OS === 'android') {
    const bgNotifications = JSON.parse(await AsyncStorage.getItem('backgroundNotifications')) || [];
    bgNotifications.push(remoteMessage);
    PushNotification.setApplicationIconBadgeNumber(bgNotifications.length);
    await AsyncStorage.setItem('backgroundNotifications', JSON.stringify(bgNotifications));
  }
});
