import { ActivityIndicator } from 'react-native';

import setupTest from '@app/config/jest-setup';

import { SendButton } from '../index';

const givenSendButton = setupTest(SendButton)();

it('renders loading state if it is loading', () => {
  const { wrapper } = givenSendButton({
    isLoading: true,
  });
  expect(wrapper.root.findAllByType(ActivityIndicator).length).toBe(1);
});

it('doesnt render loading state if its in idle state', () => {
  const { wrapper } = givenSendButton({
    isLoading: false,
  });
  expect(wrapper.root.findAllByType(ActivityIndicator).length).toBe(0);
});
