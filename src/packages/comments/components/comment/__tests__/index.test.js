import { act } from 'react-test-renderer'

import setupTest from 'Kebetoo/src/config/jest-setup'
import comments from 'Kebetoo/__fixtures__/comments'
import authors from 'Kebetoo/__fixtures__/authors'

import Comment from '../index'

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
  const { wrapper } = givenComment()
  await act(async () => {
    await wrapper.root.findByProps({ testID: 'reaction-button' }).props.onPress()
  })
  expect(wrapper.root.findByProps({ testID: 'reaction' }).props.name).toBe('md-heart')
  await act(async () => {
    await wrapper.root.findByProps({ testID: 'reaction-button' }).props.onPress()
  })
  expect(wrapper.root.findByProps({ testID: 'reaction' }).props.name).toBe('md-heart-empty')
})
