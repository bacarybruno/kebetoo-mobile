import auth from '@react-native-firebase/auth'
import { act } from 'react-test-renderer'

import setupTest from 'Kebetoo/src/config/jest-setup'
import posts from 'Kebetoo/__fixtures__/posts'
import comments from 'Kebetoo/__fixtures__/comments'

import CommentReactions, { SummaryAuthor } from '../index'

// assuming that comments is a array of 2 comment
// with one author on each one (id 1 and id 2)
const givenCommentReactions = setupTest(CommentReactions)({
  post: posts.text,
  comments,
  author: auth().currentUser.uid,
})

it('renders CommentReactions', async () => {
  let wrapper
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenCommentReactions()
    wrapper = asyncWrapper
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

describe('comment authors', () => {
  it('renders 1 comment reactors summary', async () => {
    let wrapper
    await act(async () => {
      const { wrapper: asyncWrapper } = await givenCommentReactions({
        comments: [comments[0]],
      })
      wrapper = asyncWrapper
    })
    expect(wrapper.root.findAllByType(SummaryAuthor).length).toBe(1)
  })
  it('renders 2 comment reactors summary', async () => {
    let wrapper
    await act(async () => {
      const { wrapper: asyncWrapper } = await givenCommentReactions({
        comments,
      })
      wrapper = asyncWrapper
    })
    expect(wrapper.root.findAllByType(SummaryAuthor).length).toBe(2)
  })
  it('renders no comment reactors summary if comments is empty', async () => {
    let wrapper
    await act(async () => {
      const { wrapper: asyncWrapper } = await givenCommentReactions({
        comments: [],
      })
      wrapper = asyncWrapper
    })
    expect(wrapper.root.findAllByType(SummaryAuthor).length).toBe(0)
  })
  it('renders no comment reactors summary if comments reactions are empty', async () => {
    let wrapper
    await act(async () => {
      const { wrapper: asyncWrapper } = await givenCommentReactions({
        comments: [{
          ...comments[0],
          reactions: [],
        }],
      })
      wrapper = asyncWrapper
    })
    expect(wrapper.root.findAllByType(SummaryAuthor).length).toBe(0)
  })
})
