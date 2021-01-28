import setupTest from '@app/config/jest-setup'

import Room from '../index'

const givenRoom = setupTest(Room)({
  isOpened: true,
  title: 'Hello World',
  membersCount: 100000,
  message: 'Hello and welcome to kebetoo!',
  caption: '2 days ago',
  room: {
    displayName: 'Kebetoo',
    photoURL: null,
  },
  onPress: jest.fn(),
  theme: 'blue',
})

const givenDiscoverRoom = setupTest(Room.Discover)({
  title: 'Hello World',
  membersCount: 100000,
  message: 'Hello and welcome to kebetoo!',
  caption: '2 days ago',
  room: {
    displayName: 'Kebetoo',
    photoURL: null,
  },
  onPress: jest.fn(),
  theme: 'orange',
  author: 'Jest',
})

it('renders Room', () => {
  const { wrapper } = givenRoom()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders discover Room', () => {
  const { wrapper } = givenDiscoverRoom()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
