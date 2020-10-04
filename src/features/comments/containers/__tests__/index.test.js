import { act } from 'react-test-renderer'

import setupTest from '@app/config/jest-setup'
import { strings } from '@app/config'
import * as api from '@app/shared/services/http'
import comments from '@fixtures/comments'

import Comments, { CommentReply } from '../index'
import SwipeableComment from '../../components/swipeable'
import { CommentInput } from '../../components/comment-input'
import Comment from '../../components/comment'

jest.mock('@react-navigation/native', () => {
  const posts = require('@fixtures/posts').default
  return {
    ...jest.requireActual('@react-navigation/native'),
    useRoute: () => ({
      params: {
        post: posts.audio,
      },
    }),
    useNavigation: () => ({
      navigate: jest.fn(),
      setOptions: jest.fn(),
      addListener: jest.fn(),
    }),
  }
})

beforeEach(jest.clearAllMocks)

const givenComments = setupTest(Comments)()

it('renders Comments', async () => {
  let wrapper
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenComments()
    wrapper = asyncWrapper
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders Comments in loading state', () => {
  let wrapper
  act(() => {
    const { wrapper: asyncWrapper } = givenComments()
    wrapper = asyncWrapper
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders sendbutton if there is a comment', async () => {
  let wrapper
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenComments()
    wrapper = asyncWrapper
  })
  const textInput = wrapper.root.findByProps({ placeholder: strings.comments.add_comment })
  act(() => {
    textInput.props.onValueChange('New comment')
  })
  expect(wrapper.root.findAllByProps({ testID: 'send-button' }).length).toBeTruthy()
  await act(async () => {
    await wrapper.root.findByProps({ testID: 'send-button' }).props.onPress()
  })
  expect(wrapper.root.findAllByProps({ testID: 'send-button' }).length).toBeFalsy()
})

it('selects comment to reply', async () => {
  let wrapper
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenComments()
    wrapper = asyncWrapper
  })
  expect(wrapper.root.findByType(CommentInput).props.reply).toBeNull()
  act(() => {
    wrapper.root.findAllByType(SwipeableComment)[0].props.onFulfilled()
  })
  expect(wrapper.root.findByType(CommentInput).props.reply).not.toBeNull()
})

it('clears selected comment to reply', async () => {
  let wrapper
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenComments()
    wrapper = asyncWrapper
  })
  act(() => {
    wrapper.root.findAllByType(SwipeableComment)[0].props.onFulfilled()
  })
  act(() => {
    wrapper.root.findAllByType(CommentInput)[0].props.onReplyClose()
  })
  expect(wrapper.root.findByType(CommentInput).props.reply).toBeNull()
})

it('loads replies', async () => {
  api.getComments.mockResolvedValue([comments[0]])
  api.getReplies.mockResolvedValue([comments[1]])
  let wrapper
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenComments()
    wrapper = asyncWrapper
  })
  await act(async () => {
    await wrapper.root.findByType(Comment).props.onShowReplies()
  })
  expect(wrapper.root.findAllByType(CommentReply).length).toBe(1)
})
