import { act } from 'react-test-renderer'
import ReceiveSharingIntent from 'react-native-receive-sharing-intent'
import auth from '@react-native-firebase/auth'
import { AppState, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import setupTest from '@app/config/jest-setup'
import { postsList } from '@fixtures/posts'
import routes from '@app/navigation/routes'

// eslint-disable-next-line import/default
import RealPathUtils from '@app/shared/helpers/native-modules/real-path'

import HomePage from '../index'

const givenHomePage = setupTest(HomePage)({
  __storeState__: {
    postsReducer: {
      posts: postsList,
    },
    userReducer: {
      profile: auth().currentUser,
    },
  },
  navigation: {
    navigate: jest.fn(),
  },
})

beforeEach(jest.clearAllMocks)

it('renders HomePage', async () => {
  let wrapper
  await act(async () => {
    const { wrapper: asyncWrapper } = await givenHomePage()
    wrapper = asyncWrapper
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('search for shared file', () => {
  act(() => {
    givenHomePage()
  })
  expect(ReceiveSharingIntent.getReceivedFiles).toBeCalledTimes(1)
  expect(ReceiveSharingIntent.clearReceivedFiles).toBeCalledTimes(1)
})

describe('incoming file sharing', () => {
  it('receives android shared files intent', async () => {
    Platform.OS = 'android'
    const receivedFile = {
      contentUri: 'shared-file1',
      realPath: 'jest://kebetoo.app/shares/shared-file1.png',
    }
    RealPathUtils.getOriginalFilePath.mockResolvedValueOnce(receivedFile.realPath)
    ReceiveSharingIntent
      .getReceivedFiles
      .mockImplementation((resolve) => resolve([receivedFile]))
    await act(async () => {
      await givenHomePage()
    })
    expect(useNavigation().navigate).toBeCalledTimes(1)
    expect(useNavigation().navigate).toBeCalledWith(routes.CREATE_POST, { sharedFile: 'jest://rnfs:DocumentDir/shared-file1.png' })
  })

  it('receives ios shared files intent', async () => {
    Platform.OS = 'ios'
    const receivedFile = {
      contentUri: 'jest://kebetoo.app/shares/shared-file1.png',
    }
    ReceiveSharingIntent
      .getReceivedFiles
      .mockImplementation((resolve) => resolve([receivedFile]))
    await act(async () => {
      await givenHomePage()
    })
    expect(useNavigation().navigate).toBeCalledTimes(1)
    expect(useNavigation().navigate).toBeCalledWith(
      routes.CREATE_POST, { sharedFile: receivedFile.contentUri },
    )
  })

  it('receives weblink', async () => {
    Platform.OS = 'ios'
    const receivedFile = {
      weblink: 'jest://kebetoo.app/shares/shared-file1.png',
    }
    ReceiveSharingIntent
      .getReceivedFiles
      .mockImplementation((resolve) => resolve([receivedFile]))
    await act(async () => {
      await givenHomePage()
    })
    expect(useNavigation().navigate).toBeCalledTimes(1)
    expect(useNavigation().navigate).toBeCalledWith(
      routes.CREATE_POST, { sharedText: receivedFile.weblink },
    )
  })

  it('receives text', async () => {
    Platform.OS = 'ios'
    const receivedFile = {
      text: 'jest://kebetoo.app/shares/shared-file1.png',
    }
    ReceiveSharingIntent
      .getReceivedFiles
      .mockImplementation((resolve) => resolve([receivedFile]))
    await act(async () => {
      await givenHomePage()
    })
    expect(useNavigation().navigate).toBeCalledTimes(1)
    expect(useNavigation().navigate).toBeCalledWith(
      routes.CREATE_POST, { sharedText: receivedFile.text },
    )
  })

  it('received sharing intent when app is open', () => {
    AppState.addEventListener = jest.fn()
    act(() => {
      givenHomePage()
    })
    expect(ReceiveSharingIntent.getReceivedFiles).toBeCalledTimes(1)
    const appStateChange = AppState.addEventListener.mock.calls[0][1]
    act(() => {
      appStateChange('active')
    })
    expect(ReceiveSharingIntent.getReceivedFiles).toBeCalledTimes(2)
    act(() => {
      appStateChange('inactive')
    })
    expect(ReceiveSharingIntent.getReceivedFiles).toBeCalledTimes(2)
  })
})
