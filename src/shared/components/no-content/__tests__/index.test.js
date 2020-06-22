import React from 'react'

import setupTest from 'Kebetoo/src/config/jest-setup'

import NoContent from '../index'
import Text from '../../text'

const givenNoContent = setupTest(NoContent)({
  title: 'Hello World!',
  text: 'Nothing here. Please leave!',
  children: <Text text="child" />,
})

it('renders NoContent', () => {
  const { wrapper } = givenNoContent()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
