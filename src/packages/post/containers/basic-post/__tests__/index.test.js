import { fireEvent } from 'react-native-testing-library'
import { useNavigation } from '@react-navigation/native'

import setupTest from 'Kebetoo/src/config/jest-setup'
import routes from 'Kebetoo/src/navigation/routes'
import posts from 'Kebetoo/__fixtures__/posts'
import authors from 'Kebetoo/__fixtures__/authors'

import BasicPost, { Content } from '../index'

const givenBasicPost = setupTest(BasicPost)({
  author: authors[1],
  originalAuthor: authors[0],
  isRepost: false,
  size: 35,
  withReactions: true,
})

// test only snapshots as the components behaviors are already tested
// on the standalone components
describe('renders component', () => {
  Object.keys(posts).forEach((postType) => {
    it(`[${postType}]: renders BasicPost`, () => {
      const { wrapper } = givenBasicPost({
        post: posts[postType],
      })
      expect(wrapper.toJSON()).toMatchSnapshot()
    })
    it(`[${postType}]: renders BasicPost with no author`, () => {
      const { wrapper } = givenBasicPost({
        author: null,
        originalAuthor: null,
        post: posts[postType],
      })
      expect(wrapper.toJSON()).toMatchSnapshot()
    })
    it(`[${postType}]: renders BasicPost with repost mode`, () => {
      const { wrapper } = givenBasicPost({
        post: posts[postType],
        repost: true,
      })
      expect(wrapper.toJSON()).toMatchSnapshot()
    })
    it(`[${postType}]: renders BasicPost without reactions`, () => {
      const { wrapper } = givenBasicPost({
        post: posts[postType],
        withReactions: false,
      })
      expect(wrapper.toJSON()).toMatchSnapshot()
    })
  })
})

describe('buttons', () => {
  it('handles options button press', () => {
    const { wrapper, props } = givenBasicPost({
      post: posts.text,
      onOptions: jest.fn(),
    })
    fireEvent.press(wrapper.root.findByProps({ testID: 'more-button' }))
    expect(props.onOptions).toBeCalledTimes(1)
    expect(props.onOptions).toBeCalledWith(props.post.id)
  })
  it('handles navigation on comments page', () => {
    const { wrapper, props } = givenBasicPost({
      post: posts.text,
    })
    fireEvent.press(wrapper.root.findByType(Content))
    expect(useNavigation().navigate).toBeCalledTimes(1)
    expect(useNavigation().navigate).toBeCalledWith(routes.COMMENTS, { post: props.post })
  })
  it('doesnt navigate to comments page if repost', () => {
    const { wrapper } = givenBasicPost({
      post: posts.text,
      isRepost: true,
    })
    expect(wrapper.root.findByType(Content).props.onPress).toBeUndefined()
  })
})
