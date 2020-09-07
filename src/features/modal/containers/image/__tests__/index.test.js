import { Image } from 'react-native'
import { act } from 'react-test-renderer'

import setupTest from 'Kebetoo/src/config/jest-setup'
import metrics from 'Kebetoo/src/theme/metrics'

import ImageModal from '../index'

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    params: {
      source: {
        uri: 'jest://fake-image.png',
      },
    },
  }),
}))

const givenImageModal = setupTest(ImageModal)({
  navigation: {
    setOptions: jest.fn(),
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
