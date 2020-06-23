import setupTest from 'Kebetoo/src/config/jest-setup'
import strings from 'Kebetoo/src/config/strings'

import HrLine from '../index'

const givenHrLine = setupTest(HrLine)()

it('renders HrLine', () => {
  const { wrapper } = givenHrLine({
    text: strings.auth.or_signup_with,
    style: { backgroundColor: 'red', color: 'white' },
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})
