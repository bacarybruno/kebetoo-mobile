import React from 'react'

import setupTest from 'Kebetoo/src/config/jest-setup'
import strings from 'Kebetoo/src/config/strings'

import NoContent from '../index'
import Typography, { types } from '../../typography'


const givenNoContent = setupTest(NoContent)({
  title: strings.general.no_content,
  text: strings.comments.no_content,
  children: <Typography type={types.body} text="child" />,
})

it('renders NoContent', () => {
  const { wrapper } = givenNoContent()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
