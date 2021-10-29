import { act } from 'react-test-renderer';

import setupTest from '@app/config/jest-setup';

import Room from '../index';

const givenRoom = setupTest(Room)({
  navigation: {
    navigate: jest.fn(),
    addListener: jest.fn().mockImplementation((e, callback) => { callback(); return jest.fn(); }),
  },
});

it('renders Room', () => {
  let wrapper;
  act(() => {
    wrapper = givenRoom().wrapper;
  });
  expect(wrapper.toJSON()).toMatchSnapshot();
});
