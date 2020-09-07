import { act } from 'react-test-renderer'
import { TouchableWithoutFeedback } from 'react-native'

import setupTest from '@app/config/jest-setup'
import comments from '@fixtures/comments'
import authors from '@fixtures/authors'

import Comment from '../index'

beforeEach(jest.clearAllMocks)

const givenComment = setupTest(Comment)({
  item: {
    ...comments[0],
    reactions: [],
  },
  user: authors[1].uid,
  displayName: authors[0].displayName,
  photoURL: authors[0].photoURL,
})

it('renders Comment', () => {
  const { wrapper } = givenComment()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('handles reaction', async () => {
  const { wrapper } = givenComment({
    item: {
      ...comments[0],
      reactions: [],
    },
  })
  expect(wrapper.root.findByProps({ testID: 'reaction' }).props.name).toBe('md-heart-empty')
  await act(async () => {
    await wrapper.root.findByProps({ testID: 'reaction-button' }).props.onPress()
  })
  expect(wrapper.root.findByProps({ testID: 'reaction' }).props.name).toBe('md-heart')
  await act(async () => {
    await wrapper.root.findByProps({ testID: 'reaction-button' }).props.onPress()
  })
  expect(wrapper.root.findByProps({ testID: 'reaction' }).props.name).toBe('md-heart-empty')
})

it('handles double tap', async () => {
  const { wrapper } = givenComment({
    item: {
      ...comments[0],
      reactions: [],
    },
  })
  expect(wrapper.root.findByProps({ testID: 'reaction' }).props.name).toBe('md-heart-empty')
  await act(async () => {
    await wrapper.root.findByType(TouchableWithoutFeedback).props.onPress()
    await wrapper.root.findByType(TouchableWithoutFeedback).props.onPress()
  })
  expect(wrapper.root.findByProps({ testID: 'reaction' }).props.name).toBe('md-heart')
  await act(async () => {
    await wrapper.root.findByType(TouchableWithoutFeedback).props.onPress()
  })
  expect(wrapper.root.findByProps({ testID: 'reaction' }).props.name).toBe('md-heart')
})