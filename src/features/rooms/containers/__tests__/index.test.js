import { act } from 'react-test-renderer'

import setupTest from '@app/config/jest-setup'

import Rooms from '../index'

const givenRooms = setupTest(Rooms)({
  navigation: {
    navigate: jest.fn(),
  },
})

it('renders Rooms', () => {
  let wrapper
  act(() => {
    wrapper = givenRooms().wrapper
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})
