import { act } from 'react-test-renderer';

import setupTest from '@app/config/jest-setup';

import CreateRoom from '../index';

const givenCreateRoom = setupTest(CreateRoom)({
  navigation: {
    navigate: jest.fn(),
  },
});

it('renders CreateRoom', () => {
  let wrapper;
  act(() => {
    wrapper = givenCreateRoom().wrapper;
  });
  expect(wrapper.toJSON()).toMatchSnapshot();
});
