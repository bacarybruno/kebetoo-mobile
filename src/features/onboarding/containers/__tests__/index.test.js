import { render, fireEvent } from 'react-native-testing-library';

import setupTest from '@app/config/jest-setup';

import { strings } from '@app/config';
import routes from '@app/navigation/routes';

import Onboarding, { slideItems } from '../index';

afterEach(jest.clearAllMocks);

const givenOnboarding = setupTest(Onboarding, render)({
  navigation: {
    setOptions: jest.fn(),
    navigate: jest.fn(),
    addListener: jest.fn().mockImplementation((e, callback) => { callback(); return jest.fn(); }),
  },
});

it('renders Onboarding', () => {
  const { wrapper } = givenOnboarding();
  expect(wrapper.toJSON()).toMatchSnapshot();
});

it('hides navigation header by default', () => {
  const { props } = givenOnboarding();
  expect(props.navigation.setOptions).toBeCalledWith({ headerShown: false });
});

describe('skip button', () => {
  it('shows the button by default', () => {
    const { wrapper } = givenOnboarding();
    expect(wrapper.getAllByText(strings.general.skip).length).toBe(1);
  });

  it('goes to signup if user skips the onboarding', () => {
    const { wrapper, props } = givenOnboarding();
    const skipButton = wrapper.getByText(strings.general.skip);
    fireEvent.press(skipButton);
    expect(props.navigation.navigate).toBeCalledTimes(1);
    expect(props.navigation.navigate).toBeCalledWith(routes.SIGNUP);
  });

  it('hides the button on last slide item', () => {
    const { wrapper } = givenOnboarding();
    const nextButton = wrapper.getByTestId('next-button');
    const swiper = wrapper.getByTestId('swiper');
    for (let i = 0; i < slideItems.length; i += 1) {
      fireEvent.press(nextButton);
      // this event should be fired automatically
      // but onLayout is not being called on unit tests
      fireEvent(swiper, 'onIndexChanged', i);
      if (i < slideItems.length - 1) {
        expect(wrapper.queryByText(strings.general.skip)).not.toBeNull();
      }
    }
    expect(wrapper.queryByText(strings.general.skip)).toBeNull();
  });
});

describe('submit button', () => {
  it('shows the button only on last slide items', () => {
    const { wrapper } = givenOnboarding();
    const nextButton = wrapper.getByTestId('next-button');
    const swiper = wrapper.getByTestId('swiper');
    for (let i = 0; i < slideItems.length; i += 1) {
      fireEvent.press(nextButton);
      // this event should be fired automatically
      // but onLayout is not being called on unit tests
      fireEvent(swiper, 'onIndexChanged', i);
      if (i < slideItems.length - 1) {
        expect(wrapper.queryByText(strings.general.get_started.toUpperCase())).toBeNull();
      }
    }
    expect(wrapper.queryByText(strings.general.get_started.toUpperCase())).not.toBeNull();
  });

  it('navigates to signup on submit', () => {
    const { wrapper, props } = givenOnboarding();
    const swiper = wrapper.getByTestId('swiper');
    fireEvent(swiper, 'onIndexChanged', slideItems.length - 1);
    fireEvent.press(wrapper.getByText(strings.general.get_started.toUpperCase()));
    expect(props.navigation.navigate).toBeCalledTimes(1);
    expect(props.navigation.navigate).toBeCalledWith(routes.SIGNUP);
  });
});
