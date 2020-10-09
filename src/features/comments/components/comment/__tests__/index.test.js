import { fireEvent } from 'react-native-testing-library'

import setupTest from '@app/config/jest-setup'
import comments from '@fixtures/comments'
import authors from '@fixtures/authors'
import { CommentPlaceholder } from '@app/shared/components/placeholders/comments'
import { DoubleTapHandler } from '@app/shared/components'

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
  expect(wrapper.root.findByProps({ testID: 'reaction' }).props.name).toBe('heart')
  await fireEvent.press(wrapper.root.findByProps({ testID: 'reaction-button' }))
  expect(wrapper.root.findByProps({ testID: 'reaction' }).props.name).toBe('md-heart')
  await fireEvent.press(wrapper.root.findByProps({ testID: 'reaction-button' }))
  expect(wrapper.root.findByProps({ testID: 'reaction' }).props.name).toBe('heart')
})

it('react to comment on double press', async () => {
  const { wrapper } = givenComment({
    item: {
      ...comments[0],
      reactions: [],
    },
  })
  expect(wrapper.root.findByProps({ testID: 'reaction' }).props.name).toBe('heart')
  await fireEvent(wrapper.root.findByType(DoubleTapHandler), 'onDoublePress')
  expect(wrapper.root.findByProps({ testID: 'reaction' }).props.name).toBe('md-heart')
})

it('loads replies on press', async () => {
  const { wrapper, props } = givenComment({
    onShowReplies: jest.fn(),
  })
  await fireEvent.press(wrapper.root.findByType(DoubleTapHandler))
  expect(props.onShowReplies).toBeCalledTimes(1)
})

it('renders placeholder if data is not available', () => {
  const { wrapper } = givenComment({
    displayName: null,
  })
  expect(wrapper.root.findAllByType(CommentPlaceholder).length).toBe(1)
})
