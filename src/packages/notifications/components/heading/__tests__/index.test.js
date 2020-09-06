import setupTest from 'Kebetoo/src/config/jest-setup'

import Heading from '../index'

const givenHeading = setupTest(Heading)({
  name: 'Count',
  value: 2,
})

it('renders Heading', () => {
  const { wrapper } = givenHeading()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
