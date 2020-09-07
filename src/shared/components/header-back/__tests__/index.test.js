import setupTest from '@app/config/jest-setup'

import HeaderBack from '../index'

const givenHeaderBack = setupTest(HeaderBack)({
  tintColor: 'red',
})
const givenHeaderClose = setupTest(HeaderBack.Close)({
  tintColor: 'red',
})

it('renders HeaderBack', () => {
  const { wrapper } = givenHeaderBack()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders HeaderClose', () => {
  const { wrapper } = givenHeaderClose()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
