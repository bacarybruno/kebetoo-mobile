import CameraRoll from '@react-native-community/cameraroll'
import reactNavigation from '@react-navigation/native'
import { act } from 'react-test-renderer'
import { fireEvent } from 'react-native-testing-library'
import RNCameraRollPicker from '@kebetoo/camera-roll-picker'
import ImageCropPicker from 'react-native-image-crop-picker'
import ActionButton from 'react-native-action-button'

import setupTest from '@app/config/jest-setup'
import { strings } from '@app/config'

import CameraRollPicker from '../index'

beforeEach(jest.clearAllMocks)

const navigation = {
  setOptions: jest.fn(),
  goBack: jest.fn(),
}

const albumsMock = [
  { title: 'Pictures', count: 2 },
  { title: 'Camera', count: 1 },
]

const createAsset = (uri, isVideo) => ({
  node: {
    type: isVideo ? 'video/mp4' : 'image/jpeg',
    group_name: isVideo ? 'Camera' : 'Pictures',
    image: { uri },
  },
})

const photosMock = {
  page_info: {
    has_next_page: false,
    end_cursor: null,
  },
  edges: [
    createAsset('jest://kebetoo-camera-roll/asset1.png'),
    createAsset('jest://kebetoo-camera-roll/asset2.png'),
    createAsset('jest://kebetoo-camera-roll/asset3.mp4', true),
  ],
}

const routeParamsMock = {
  assetType: CameraRollPicker.AssetTypes.Photos,
  maximum: 1,
  onSelectedItem: jest.fn(),
}

const givenCameraRollPicker = async ({
  routeParams = routeParamsMock,
  props = { navigation },
  photos = photosMock,
  albums = albumsMock,
}) => {
  CameraRoll.getPhotos.mockResolvedValue(photos)
  CameraRoll.getAlbums.mockResolvedValue(albums)
  reactNavigation.useRoute = jest.fn().mockReturnValue({ params: routeParams })
  return new Promise((resolve) => {
    let wrapperProps
    act(async () => {
      wrapperProps = await setupTest(CameraRollPicker)(props)()
    }).then(() => {
      resolve(wrapperProps)
    })
  })
}

it('renders CameraRollPicker', async () => {
  const { wrapper } = await givenCameraRollPicker({})
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('sets album name as page title when selected', async () => {
  const { wrapper } = await givenCameraRollPicker({})
  const { title, count } = albumsMock[0]
  const album = wrapper.root.findByProps({ testID: title })
  const lastMockCallIndex = navigation.setOptions.mock.calls.length - 1
  const headerRightButton = navigation.setOptions.mock.calls[lastMockCallIndex][0].headerRight()
  headerRightButton.props.onPress()
  expect(navigation.setOptions).toBeCalledWith({ title: strings.create_post.albums })
  await act(() => {
    fireEvent.press(album)
  })
  expect(navigation.setOptions).toBeCalledWith({ title: `${title} (${count})` })
})

it('crops selected photo from picker', async () => {
  const cropperResult = { path: photosMock.edges[0].node.image.uri, mime: 'image/png' }
  ImageCropPicker.openCropper.mockResolvedValue(cropperResult)

  const { wrapper } = await givenCameraRollPicker({})
  const picker = wrapper.root.findByType(RNCameraRollPicker)
  await act(async () => {
    await picker.props.callback(photosMock.edges, {
      ...photosMock.edges[0].node.image,
      type: photosMock.edges[0].node.type,
    })
  })
  expect(ImageCropPicker.openCropper).toBeCalledTimes(1)
  expect(ImageCropPicker.openCropper).toBeCalledWith(
    expect.objectContaining({ path: photosMock.edges[0].node.image.uri }),
  )
  expect(routeParamsMock.onSelectedItem).toBeCalledTimes(1)
  expect(routeParamsMock.onSelectedItem).toBeCalledWith({
    uri: cropperResult.path,
    type: cropperResult.mime,
  })
})

it('submits selection', async () => {
  const cropperResult = { path: photosMock.edges[0].node.image.uri, mime: 'image/png' }
  ImageCropPicker.openCropper.mockResolvedValue(cropperResult)

  const { wrapper } = await givenCameraRollPicker({
    routeParams: {
      ...routeParamsMock,
      maximum: 5,
    },
  })

  const picker = wrapper.root.findByType(RNCameraRollPicker)
  await act(async () => {
    await picker.props.callback(photosMock.edges, photosMock.edges[0].node.image)
  })

  const lastMockCallIndex = navigation.setOptions.mock.calls.length - 1
  const headerRightButton = navigation.setOptions.mock.calls[lastMockCallIndex][0].headerRight()
  headerRightButton.props.onPress()

  expect(routeParamsMock.onSelectedItem).toBeCalledTimes(1)
  expect(routeParamsMock.onSelectedItem).toBeCalledWith(photosMock.edges)
})

it('selects an item from camera', async () => {
  const cropperResult = {
    path: photosMock.edges[0].node.image.uri,
    mime: 'video/mp4',
    duration: 1000,
  }
  ImageCropPicker.openCamera.mockResolvedValue(cropperResult)

  const { wrapper } = await givenCameraRollPicker({})
  const fab = wrapper.root.findByType(ActionButton)
  await act(async () => {
    await fab.props.onPress()
  })
  expect(routeParamsMock.onSelectedItem).toBeCalledTimes(1)
  expect(routeParamsMock.onSelectedItem).toBeCalledWith({
    uri: cropperResult.path,
    type: cropperResult.mime,
    duration: cropperResult.duration / 1000,
  })
})
