import setupTest from 'Kebetoo/src/config/jest-setup'

import ImageModal from '../index'

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    params: {
      source: {
        uri: 'jest://fake-image.png',
      },
      width: 100,
      height: 100,
    },
  }),
}))

const givenImageModal = setupTest(ImageModal)({
  navigation: {
    setOptions: jest.fn(),
  },
})

it('renders ImageModal', () => {
  const { wrapper } = givenImageModal()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
