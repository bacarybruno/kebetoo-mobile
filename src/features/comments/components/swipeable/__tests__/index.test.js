import React from 'react'
import { View } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'

import setupTest from '@app/config/jest-setup'

import SwipeableComment from '../index'

const givenSwipeableComment = setupTest(SwipeableComment)({
  onFulfilled: jest.fn(),
  children: <View testID="swipeable-content" />,
})

it('renders SwipeableComment', () => {
  const { wrapper } = givenSwipeableComment()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('closes swipeable', () => {
  const { wrapper, props } = givenSwipeableComment()
  wrapper.root.findByType(Swipeable).props.onSwipeableLeftOpen()
  expect(props.onFulfilled).toBeCalledTimes(1)
})
