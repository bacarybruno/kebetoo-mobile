import setupTest from 'Kebetoo/src/config/jest-setup'

import HrLine from '../index'

const givenHrLine = setupTest(HrLine)()

it('renders HrLine', () => {
  const { wrapper } = givenHrLine({
    text: 'Sign up with',
    style: { backgroundColor: 'red', color: 'white' },
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})
