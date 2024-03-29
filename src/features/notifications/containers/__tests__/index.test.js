import { act } from 'react-test-renderer';
import { useNavigation } from '@react-navigation/native';
import routes from '@app/navigation/routes';
import auth from '@react-native-firebase/auth';

import setupTest from '@app/config/jest-setup';
import notifications from '@fixtures/notifications';
import { strings } from '@app/config';
import { NOTIFICATION_STATUS } from '@app/shared/hooks/notifications';

import NotificationsPage from '../index';
import Notification from '../../components/notification';

const store = {
  notificationsReducer: {
    notifications,
  },
  userReducer: {
    profile: auth().currentUser,
  },
};

const givenNotificationsPageWithStore = (storeState) => setupTest(NotificationsPage)({
  __storeState__: storeState,
});

it('renders NotificationsPage', async () => {
  let wrapper;

  await act(async () => {
    const { wrapper: wrapperAsync } = await givenNotificationsPageWithStore(store)();
    wrapper = wrapperAsync;
  });

  expect(wrapper.toJSON()).toMatchSnapshot();
});

it('renders all notifications', async () => {
  let wrapper;

  await act(async () => {
    const { wrapper: wrapperAsync } = await givenNotificationsPageWithStore(store)();
    wrapper = wrapperAsync;
  });

  expect(wrapper.root.findAllByType(Notification).length).toBe(notifications.length);
  expect(wrapper.root.findAllByProps({ name: strings.notifications.recent }).length).toBe(1);
  expect(wrapper.root.findAllByProps({ name: strings.notifications.already_seen }).length).toBe(1);
});

it('renders only recent notifications if no past one', async () => {
  // define all notifications as already seen
  const testNotifications = notifications.map((notification) => ({
    ...notification, status: NOTIFICATION_STATUS.NEW,
  }));

  const testStore = {
    notificationsReducer: {
      notifications: testNotifications,
    },
    userReducer: {
      profile: auth().currentUser,
    },
  };

  let wrapper;
  await act(async () => {
    const { wrapper: wrapperAsync } = await givenNotificationsPageWithStore(testStore)();
    wrapper = wrapperAsync;
  });

  expect(wrapper.root.findAllByType(Notification).length).toBe(notifications.length);
  expect(wrapper.root.findAllByProps({ name: strings.notifications.recent }).length).toBe(1);
  expect(wrapper.root.findAllByProps({ name: strings.notifications.already_seen }).length).toBe(0);
});


it('renders only past notifications if no recent one', async () => {
  // define all notifications as already seen
  const testNotifications = notifications.map((notification) => ({
    ...notification, status: NOTIFICATION_STATUS.SEEN,
  }));

  const testStore = {
    notificationsReducer: {
      notifications: testNotifications,
    },
    userReducer: {
      profile: auth().currentUser,
    },
  };

  let wrapper;
  await act(async () => {
    const { wrapper: wrapperAsync } = await givenNotificationsPageWithStore(testStore)();
    wrapper = wrapperAsync;
  });

  expect(wrapper.root.findAllByType(Notification).length).toBe(notifications.length);
  expect(wrapper.root.findAllByProps({ name: strings.notifications.recent }).length).toBe(0);
  expect(wrapper.root.findAllByProps({ name: strings.notifications.already_seen }).length).toBe(1);
});

describe('opening notifications', () => {
  notifications.forEach((message) => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it(`opens ${message.message.data.type} notification`, async () => {
      const testStore = {
        notificationsReducer: {
          notifications: [message],
        },
        userReducer: {
          profile: auth().currentUser,
        },
      };

      let wrapper;

      await act(async () => {
        const { wrapper: wrapperAsync } = await givenNotificationsPageWithStore(testStore)();
        wrapper = wrapperAsync;
      });

      const notification = wrapper.root.findAllByType(Notification)[0];

      await act(async () => {
        await notification.props.onPress();
      });

      expect(useNavigation().navigate).toBeCalledTimes(1);
      expect(useNavigation().navigate).toBeCalledWith(routes.COMMENTS, { post: expect.anything() });
    });
  });
});
