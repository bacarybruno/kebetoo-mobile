import setupTest from 'Kebetoo/src/config/jest-setup'

import Text from '../index'

const givenText = setupTest(Text)({
  text: 'Hello World',
})

it('renders Text', () => {
  const { wrapper } = givenText()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
