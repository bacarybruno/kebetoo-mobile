import { fireEvent } from 'react-native-testing-library';
import { useNavigation } from '@react-navigation/native';
import { act } from 'react-test-renderer';
import auth from '@react-native-firebase/auth';
import { TouchableOpacity } from 'react-native';

import setupTest from '@app/config/jest-setup';
import routes from '@app/navigation/routes';
import posts from '@fixtures/posts';
import authors from '@fixtures/authors';
import { strings } from '@app/config';

import BasicPost, { Content, propsAreEqual } from '../index';

beforeEach(jest.clearAllMocks);

const componentProps = {
  __storeState__: {
    userReducer: {
      profile: auth().currentUser,
    },
  },
  author: authors[1],
  originalAuthor: authors[0],
  isRepost: false,
  size: 35,
  withReactions: true,
  badge: strings.general.new,
};
const givenBasicPost = setupTest(BasicPost)(componentProps);

// test only snapshots as the components behaviors are already tested
// on the standalone components
describe('renders component', () => {
  Object.keys(posts).forEach((postType) => {
    it(`[${postType}]: renders BasicPost`, async () => {
      let wrapper;
      await act(async () => {
        const { wrapper: asyncWrapper } = await givenBasicPost({
          post: posts[postType],
        });
        wrapper = asyncWrapper;
      });
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
    it(`[${postType}]: renders BasicPost with no author`, async () => {
      let wrapper;
      await act(async () => {
        const { wrapper: asyncWrapper } = await givenBasicPost({
          author: null,
          originalAuthor: null,
          post: posts[postType],
        });
        wrapper = asyncWrapper;
      });
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
    it(`[${postType}]: renders BasicPost with repost mode`, async () => {
      let wrapper;
      await act(async () => {
        const { wrapper: asyncWrapper } = await givenBasicPost({
          post: posts[postType],
          isRepost: true,
        });
        wrapper = asyncWrapper;
      });
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
    it(`[${postType}]: renders BasicPost without reactions`, async () => {
      let wrapper;
      await act(async () => {
        const { wrapper: asyncWrapper } = await givenBasicPost({
          post: posts[postType],
          withReactions: false,
        });
        wrapper = asyncWrapper;
      });
      expect(wrapper.toJSON()).toMatchSnapshot();
    });
  });
});

describe('buttons', () => {
  it('handles options button press', async () => {
    let wrapper;
    let props;
    await act(async () => {
      const { wrapper: asyncWrapper, props: asyncProps } = await givenBasicPost({
        post: posts.text,
        onOptions: jest.fn(),
      });
      wrapper = asyncWrapper;
      props = asyncProps;
    });
    fireEvent.press(wrapper.root.findByProps({ testID: 'more-button' }));
    expect(props.onOptions).toBeCalledTimes(1);
    expect(props.onOptions).toBeCalledWith(props.post.id);
  });
  it('handles navigation on comments page', async () => {
    let wrapper;
    let props;
    await act(async () => {
      const { wrapper: asyncWrapper, props: asyncProps } = await givenBasicPost({
        post: posts.text,
      });
      wrapper = asyncWrapper;
      props = asyncProps;
    });
    fireEvent.press(wrapper.root.findByType(Content));
    expect(useNavigation().navigate).toBeCalledTimes(1);
    expect(useNavigation().navigate).toBeCalledWith(routes.COMMENTS, { post: props.post });
  });
  it('doesnt navigate to comments page if repost', async () => {
    let wrapper;
    await act(async () => {
      const { wrapper: asyncWrapper } = await givenBasicPost({
        post: posts.text,
        isRepost: true,
      });
      wrapper = asyncWrapper;
    });
    expect(wrapper.root.findByType(Content).props.onPress).toBeUndefined();
  });
});

it('compare props properly', () => {
  const propsWithAudioPost = {
    ...componentProps,
    post: posts.audio,
  };
  const propsWithTextPost = {
    ...componentProps,
    post: posts.text,
  };
  expect(propsAreEqual(propsWithAudioPost, propsWithAudioPost)).toBe(true);
  expect(propsAreEqual(propsWithAudioPost, propsWithTextPost)).toBe(false);
});

it('shows user profile', async () => {
  let wrapper;
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenBasicPost({
      post: posts.text,
      isRepost: true,
    });
    wrapper = asyncWrapper;
  });
  wrapper.root.findAllByType(TouchableOpacity)[0].props.onPress();
  expect(useNavigation().navigate).toBeCalledTimes(1);
  expect(useNavigation().navigate).toBeCalledWith(routes.USER_PROFILE, expect.anything());
});
