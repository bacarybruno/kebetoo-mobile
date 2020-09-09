import { TouchableNativeFeedback } from 'react-native'

import setupTest from '@app/config/jest-setup'

import Pressable, { CustomPressable } from '../index'

const givenPressable = setupTest(Pressable)({
  borderless: true,
  foreground: false,
})

it('renders Pressable', () => {
  const { wrapper } = givenPressable()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders a CustomPressable component for old versions', () => {
  const { wrapper } = givenPressable({
    platform: {
      OS: 'android',
      Version: 1,
      select: (objs) => objs.default,
    },
  })
  expect(wrapper.root.findAllByType(CustomPressable).length).toBe(1)
})

it('renders a CustomPressable component for newer versions', () => {
  const { wrapper } = givenPressable({
    platform: {
      OS: 'ios',
      Version: 50,
      select: (objs) => objs.default,
    },
  })
  expect(wrapper.root.findAllByType(TouchableNativeFeedback).length).toBe(1)
})
