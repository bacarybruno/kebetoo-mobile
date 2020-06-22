import setupTest from 'Kebetoo/src/config/jest-setup'

import Logo from '../index'

const givenLogo = setupTest(Logo)()

it('renders Logo', () => {
  const { wrapper } = givenLogo()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
