/* eslint-disable import/no-extraneous-dependencies */
import { NativeModules } from 'react-native';
import TestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import MockDate from 'mockdate';
import configureStore from 'redux-mock-store';
import 'react-native-gesture-handler/jestSetup';
import { renderHook } from '@testing-library/react-hooks';
import auth from '@react-native-firebase/auth';
import { SafeAreaContext } from '@app/shared/contexts';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PortalProvider } from '@gorhom/portal';

// Silence the warning https://github.com/facebook/react-native/issues/11094#issuecomment-263240420
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

// wix/react-native-keyboard-input
NativeModules.KeyboardTrackingViewTempManager = {
  KeyboardTrackingScrollBehaviorNone: 'NONE',
  KeyboardTrackingScrollBehaviorScrollToBottomInvertedOnly: 'SCROLL_TO_BOTTOM_INVERTED_ONLY',
  KeyboardTrackingScrollBehaviorFixedOffset: 'FIXED_OFFSET',
};

NativeModules.RealPathUtils = {
  getOriginalFilePath: jest.fn(),
};

const mockedStoreState = {
  postsReducer: {
    posts: [],
    authors: [],
  },
  notificationsReducer: {
    notifications: [],
  },
  userReducer: {
    profile: {
      ...auth().currentUser,
      isLoggedIn: true,
    },
  },
  appReducer: {
    theme: 'system',
    locale: 'fr',
  },
};
// helper to setup unit tests
/* eslint-disable comma-dangle */
const setupTest = (WrappedComponent, renderFn = TestRenderer.create) => {
  let wrapper = null;
  return (defaultProps = {}) => (additionalProps = {}) => {
    const {
      store, __storeState__ = mockedStoreState, disconnectNavigation, ...props
    } = defaultProps;
    const propsWithArgs = {
      ...props,
      ...additionalProps,
    };
    const mockStore = configureStore();
    const safeAreaCtxValue = {
      updateTopSafeAreaColor: jest.fn(),
      updateBottomSafeAreaColor: jest.fn(),
      resetStatusBars: jest.fn(),
    };
    const Stack = createStackNavigator();
    const Component = (
      <SafeAreaContext.Provider value={safeAreaCtxValue}>
        <Provider store={store || mockStore(__storeState__)}>
          <PortalProvider>
            {disconnectNavigation
              ? <WrappedComponent {...propsWithArgs} />
              : (
                <NavigationContainer>
                  <Stack.Navigator>
                    <Stack.Screen name="jest">
                      {() => <WrappedComponent {...propsWithArgs} />}
                    </Stack.Screen>
                  </Stack.Navigator>
                </NavigationContainer>
              )}
          </PortalProvider>
        </Provider>
      </SafeAreaContext.Provider>
    );
    wrapper = renderFn(Component);
    return { wrapper, props: propsWithArgs };
  };
};

export const setupHook = (useHook, ...props) => {
  const mockStore = configureStore();
  const store = mockStore(mockedStoreState);
  const wrapper = ({ children }) => (
    <Provider store={store}>
      {children}
    </Provider>
  );
  const rendered = renderHook(() => useHook(...props), {
    wrapper,
  });
  return rendered;
};

/**
 * Explicit mocks
 * Create mocks here only if they can't be created on the __mocks__ folder
 */

jest.useFakeTimers();
jest.setTimeout(30000);

// react-navigation
const mockedNavigate = jest.fn();
const mockedSetOptions = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockedNavigate,
    setOptions: mockedSetOptions,
    addListener: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  useFocusEffect: (cb) => cb()
}));
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => { };
  Reanimated.default.addWhitelistedUIProps = () => { };

  return Reanimated;
});

// react-native-screens
jest.mock('react-native-screens', () => {
  const Screens = jest.requireActual('react-native-screens');
  Screens.enableScreens = () => { };
  return Screens;
});

// date
MockDate.set(new Date(Date.parse('2020-06-25T13:30:00+02:00')));

export default setupTest;
