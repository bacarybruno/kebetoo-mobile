import setupTest from '@app/config/jest-setup'

import CommentPlaceholder from '../comments'

const givenCommentPlaceholder = setupTest(CommentPlaceholder)()

it('renders CommentPlaceholder', () => {
  const { wrapper } = givenCommentPlaceholder()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
