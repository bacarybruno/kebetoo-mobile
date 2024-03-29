import Share from 'react-native-share';
import { act, fireEvent } from 'react-native-testing-library';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import setupTest from '@app/config/jest-setup';
import { strings } from '@app/config';
import { api } from '@app/shared/services';
import routes from '@app/navigation/routes';

import Profile from '../index';

const storeState = {
  userReducer: {
    stats: {
      posts: 100,
      comments: 100,
      reactions: 100,
    },
    profile: auth().currentUser,
  },
  appReducer: {
    theme: 'system',
  },
};
const givenProfile = setupTest(Profile)({
  __storeState__: storeState,
});

it('renders Profile', async () => {
  let wrapper = null;
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenProfile();
    wrapper = asyncWrapper;
  });
  expect(wrapper.toJSON()).toMatchSnapshot();
});

describe('displays the right stats for', () => {
  const { stats } = storeState.userReducer;
  const statsItems = [{
    name: 'posts',
    title: strings.profile.posts.toLowerCase(),
    value: stats.posts,
    resolvedValue: 10,
  }, {
    name: 'comments',
    title: strings.profile.comments.toLowerCase(),
    value: stats.comments,
    resolvedValue: 100,
  }, {
    name: 'reactions',
    title: strings.profile.reactions.toLowerCase(),
    value: stats.reactions,
    resolvedValue: 1000,
  }];
  statsItems.forEach((item) => {
    it(`[${item.name}]: when request is resolved`, async () => {
      api.authors.countActivities.mockResolvedValue({
        posts: item.resolvedValue,
        comments: item.resolvedValue,
        reactions: item.resolvedValue,
      });
      let wrapper = null;
      await act(async () => {
        const { wrapper: asyncWrapper } = await givenProfile();
        wrapper = asyncWrapper;
      });
      expect(wrapper.root.findByProps({ title: item.title }).props.value).toBe(item.resolvedValue);
    });
    it(`[${item.name}]: when request fails`, async () => {
      api.authors.countActivities.mockRejectedValue({
        posts: item.resolvedValue,
        comments: item.resolvedValue,
        reactions: item.resolvedValue,
      });
      let wrapper = null;
      await act(async () => {
        const { wrapper: asyncWrapper } = await givenProfile();
        wrapper = asyncWrapper;
      });
      expect(wrapper.root.findByProps({ title: item.title }).props.value).toBe(item.value);
    });
  });
});

describe('buttons', () => {
  it('navigates to manage-post page', async () => {
    let wrapper = null;
    const { navigate } = useNavigation();
    await act(async () => {
      const { wrapper: asyncWrapper } = await givenProfile();
      wrapper = asyncWrapper;
    });
    fireEvent.press(wrapper.root.findByProps({ text: strings.profile.manage_posts_title }));
    expect(navigate).toBeCalledTimes(1);
    expect(navigate).toBeCalledWith(routes.MANAGE_POSTS);
  });
  it('signout user', async () => {
    let wrapper = null;
    const { signOut } = auth();
    await act(async () => {
      const { wrapper: asyncWrapper } = await givenProfile();
      wrapper = asyncWrapper;
    });
    await fireEvent.press(wrapper.root.findByProps({ text: strings.profile.signout }));
    await expect(signOut).toBeCalledTimes(1);
  });
  it('shares the app', async () => {
    let wrapper = null;
    await act(async () => {
      const { wrapper: asyncWrapper } = await givenProfile();
      wrapper = asyncWrapper;
    });
    fireEvent.press(wrapper.root.findByProps({ text: strings.profile.invite_fiend_title }));
    expect(Share.open).toBeCalledTimes(1);
  });
});
