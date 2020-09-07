import setupTest from 'Kebetoo/src/config/jest-setup'

import UserProfile from '../index'

const givenUserProfile = setupTest(UserProfile)({
  navigation: {
    setOptions: jest.fn()
  }
})

it('renders UserProfile', () => {
  const { wrapper } = givenUserProfile()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
