import { act } from 'react-test-renderer';
import auth from '@react-native-firebase/auth';
import { Platform } from 'react-native';
import ShareMenu from 'react-native-share-menu';

import setupTest from '@app/config/jest-setup';
import { postsList } from '@fixtures/posts';
import routes from '@app/navigation/routes';

// eslint-disable-next-line import/default
import RealPathUtils from '@app/shared/helpers/native-modules/real-path';

import HomePage from '../index';

const navigate = jest.fn();
const givenHomePage = setupTest(HomePage)({
  __storeState__: {
    postsReducer: {
      posts: postsList,
      page: 0,
      isLoading: true,
      isRefreshing: false,
      filter: 'score',
    },
    userReducer: {
      profile: auth().currentUser,
    },
  },
  navigation: {
    navigate,
  },
});

beforeEach(jest.clearAllMocks);

it('renders HomePage', async () => {
  let wrapper;
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenHomePage();
    wrapper = asyncWrapper;
  });
  expect(wrapper.toJSON()).toMatchSnapshot();
});

it('search for shared file', () => {
  act(givenHomePage);
  expect(ShareMenu.getInitialShare).toBeCalledTimes(1);
  expect(ShareMenu.addNewShareListener).toBeCalledTimes(1);
});

describe('incoming file sharing', () => {
  it('receives android shared files intent', async () => {
    Platform.OS = 'android';
    const receivedFile = {
      data: 'kebetoo.app/shares/shared-file1.png',
      mimeType: 'image/png',
      realPath: 'jest://kebetoo.app/shares/shared-file1.png',
      copiedPath: 'jest://rnfs:DocumentDir/shared-file1.png',
    };
    RealPathUtils
      .getOriginalFilePath
      .mockResolvedValueOnce(receivedFile.realPath);
    ShareMenu
      .getInitialShare
      .mockImplementation((resolve) => resolve(receivedFile));
    await act(async () => {
      await givenHomePage();
    });
    expect(navigate).toBeCalledTimes(1);
    expect(navigate).toBeCalledWith(routes.CREATE_POST, {
      file: receivedFile.copiedPath,
    });
  });

  it('receives ios shared files intent', async () => {
    Platform.OS = 'ios';
    const receivedFile = {
      data: 'kebetoo.app/shares/shared-file1.png',
      mimeType: 'image/png',
    };
    ShareMenu
      .getInitialShare
      .mockImplementation((resolve) => resolve(receivedFile));
    await act(async () => {
      await givenHomePage();
    });
    expect(navigate).toBeCalledTimes(1);
    expect(navigate).toBeCalledWith(routes.CREATE_POST, {
      file: receivedFile.data,
    });
  });

  it('receives text', async () => {
    Platform.OS = 'ios';
    const receivedFile = {
      data: 'jest://kebetoo.app/shares/shared-file1.png',
      mimeType: 'text/plain',
    };
    ShareMenu
      .getInitialShare
      .mockImplementation((resolve) => resolve(receivedFile));
    await act(givenHomePage);
    expect(navigate).toBeCalledTimes(1);
    expect(navigate).toBeCalledWith(
      routes.CREATE_POST, { sharedText: receivedFile.data },
    );
  });

  it('removes listener', () => {
    Platform.OS = 'ios';
    const removeSpy = jest.fn();
    ShareMenu.addNewShareListener = jest.fn().mockReturnValue({ remove: removeSpy });
    const { wrapper } = givenHomePage();
    wrapper.unmount();
    expect(removeSpy).toBeCalledTimes(1);
  });
});
