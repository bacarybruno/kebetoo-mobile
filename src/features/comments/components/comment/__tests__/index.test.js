import { act } from 'react-test-renderer'
import { TouchableWithoutFeedback } from 'react-native'
import { fireEvent } from 'react-native-testing-library'

import setupTest from '@app/config/jest-setup'
import comments from '@fixtures/comments'
import authors from '@fixtures/authors'
import { CommentPlaceholder } from '@app/shared/components/placeholders/comments'

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
  await fireEvent.press(wrapper.root.findByProps({ testID: 'reaction-button' }))
  expect(wrapper.root.findByProps({ testID: 'reaction' }).props.name).toBe('md-heart')
  await fireEvent.press(wrapper.root.findByProps({ testID: 'reaction-button' }))
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

it('renders placeholder if data is not available', () => {
  const { wrapper } = givenComment({
    displayName: null,
  })
  expect(wrapper.root.findAllByType(CommentPlaceholder).length).toBe(1)
})
