import { Image } from 'react-native'
import { act } from 'react-test-renderer'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import { fireEvent } from 'react-native-testing-library'

import setupTest from '@app/config/jest-setup'
import { colors, metrics } from '@app/theme'
import { rgbaToHex } from '@app/theme/colors'

import ImageModal from '../index'

beforeEach(jest.clearAllMocks)

const givenImageModal = setupTest(ImageModal)({
  navigation: {
    setOptions: jest.fn(),
  },
  route: {
    params: {
      source: {
        uri: 'jest://fake-image.png',
      },
    },
  },
})

it('renders ImageModal', () => {
  const getImageSizeMock = jest.spyOn(Image, 'getSize')
  getImageSizeMock.mockImplementation((image, onSuccess) => onSuccess(100, 100))

  let wrapper
  act(() => {
    const { wrapper: wrapperAsync } = givenImageModal()
    wrapper = wrapperAsync
  })

  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders image without prefedined size', () => {
  const getImageSizeMock = jest.spyOn(Image, 'getSize')
  getImageSizeMock.mockImplementation((image, onSuccess) => onSuccess(1000, 500))

  let wrapper
  act(() => {
    const { wrapper: wrapperAsync } = givenImageModal()
    wrapper = wrapperAsync
  })

  expect(wrapper.root.findAllByType(Image)[0].props.style.aspectRatio).toBe(2)
})

it('renders image with default aspect ratio', () => {
  const getImageSizeMock = jest.spyOn(Image, 'getSize')
  getImageSizeMock.mockImplementation((image, onSuccess, onError) => onError())

  let wrapper
  act(() => {
    const { wrapper: wrapperAsync } = givenImageModal()
    wrapper = wrapperAsync
  })

  expect(wrapper.root.findAllByType(Image)[0].props.style.aspectRatio).toBe(
    metrics.aspectRatio.vertical,
  )
})

it('adjust navigation bar on press', () => {
  const { wrapper } = givenImageModal()
  fireEvent.press(wrapper.root.findByProps({ testID: 'pressable' }))
  fireEvent.press(wrapper.root.findByProps({ testID: 'pressable' }))
  fireEvent.press(wrapper.root.findByProps({ testID: 'pressable' }))
  expect(changeNavigationBarColor).toBeCalledTimes(2)
  const { calls } = changeNavigationBarColor.mock
  expect(calls[0]).toEqual(calls[1])
})

it('resets styles on unmount', () => {
  const { wrapper } = givenImageModal()
  wrapper.unmount()
  expect(changeNavigationBarColor).toBeCalledTimes(2)
  expect(changeNavigationBarColor).toBeCalledWith(rgbaToHex(colors.background))
})
