import setupTest from 'Kebetoo/src/config/jest-setup'
import { POST_TYPES } from 'Kebetoo/src/features/post/containers/basic-post'

import ImageContent from '../index'

const givenImageContent = setupTest(ImageContent)({
  content: 'test image',
  style: { elevation: 3 },
  onPress: jest.fn(),
})

it('renders ImageContent', () => {
  const { wrapper } = givenImageContent()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders ImageContent in repost mode', () => {
  const { wrapper } = givenImageContent({
    type: POST_TYPES.REPOST,
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})
