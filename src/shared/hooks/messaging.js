import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from 'react-native-push-notification';

import routes from '@app/navigation/routes';
import { api } from '@app/shared/services';

import useUser from './user';
import useNotifications from './notifications';

const useMessaging = (navigation) => {
  const { isLoggedIn } = useUser();
  const { profile } = useUser();
  const { fetchPendingNotifications, setupNotifications } = useNotifications();

  const handleInitialNotification = useCallback((remoteMessage) => {
    if (remoteMessage && isLoggedIn) {
      navigation.current.navigate(routes.NOTIFICATIONS);
    }
  }, [isLoggedIn, navigation]);

  useEffect(() => {
    messaging().getInitialNotification().then(handleInitialNotification);
    // notification opened app from background state
    messaging().onNotificationOpenedApp(handleInitialNotification);

    const unsubscribeTokenRefresh = messaging().onTokenRefresh((notificationToken) => {
      api.authors.update(profile.uid, { notificationToken });
    });

    return unsubscribeTokenRefresh;
  }, [handleInitialNotification, profile.uid]);

  useEffect(() => {
    const handlePendingNotifications = async () => {
      fetchPendingNotifications();
      // remove background notifications
      await AsyncStorage.removeItem('backgroundNotifications');
      // reset badge number
      PushNotification.setApplicationIconBadgeNumber(0);
    };

    const appStateChange = (state) => {
      if (state === 'active') {
        handlePendingNotifications();
      }
    };

    handlePendingNotifications();

    AppState.addEventListener('change', appStateChange);
    return () => {
      AppState.removeEventListener('change', appStateChange);
    };
  }, [fetchPendingNotifications]);

  return {
    setupNotifications,
  };
};

// persistNotification({
//   messageId: 'test-1',
//   sentTime: Date.now(),
//   data: {
//     type: 'system',
//     payload: JSON.stringify({
//       author: {
//         displayName: 'Kebetoo',
//         certified: true,
//         photoURL: 'https://kebetoo.com/assets/img/icon.png',
//       },
//       systemMessage: '',
//       content: 'Kebetoo vous souhaite la bienvenue!',
//       postId: '600316e3c78fa70017137655',
//     }),
//   },
// })

export default useMessaging;
