import setupTest from 'Kebetoo/src/config/jest-setup'

import NoResult from '../index'

const givenNoResult = setupTest(NoResult)({
  query: 'John Doe'
})

it('renders NoResult', () => {
  const { wrapper } = givenNoResult()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
