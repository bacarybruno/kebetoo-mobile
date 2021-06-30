import setupTest from '@app/config/jest-setup'
import routes from '@app/navigation/routes'
import { api } from '@app/shared/services'
import { useNavigation } from '@react-navigation/native'
import { Linking } from 'react-native'

import FormatedTypography from '../index'

beforeEach(jest.clearAllMocks)

const infos = {
  website: 'https://www.kebetoo.com',
  phone: '+221777777777',
  hashtag: '#kebetoo',
  username: '@bacary',
  bold: '*bold* ',
  italic: '_italic_',
  strikeThrough: '~strikeThrough~',
}

const givenFormatedTypography = setupTest(FormatedTypography)({
  text: `
    Hello World!
    Here is a ${infos.bold} text 
    Here is a ${infos.italic} text 
    Here is a ${infos.strikeThrough} text 
    Made with love by ${infos.username}
    Website: ${infos.website}
    Phone: ${infos.phone}
    ${infos.hashtag}
  `,
  numberOfLines: 2,
  rawValue: true,
})

it('renders FormatedTypography', () => {
  const { wrapper } = givenFormatedTypography()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('opens url', () => {
  const { wrapper } = givenFormatedTypography()
  const website = wrapper.root.findAllByProps({ children: infos.website })[0]
  website.props.onPress()
  expect(Linking.openURL).toBeCalledTimes(1)
  expect(Linking.openURL).toBeCalledWith(infos.website)
})

it('handles username', async () => {
  api.authors.getByUsername.mockReturnValueOnce([{ _id: 123 }])
  const { wrapper } = givenFormatedTypography()
  const username = wrapper.root.findAllByProps({ children: infos.username })[0]
  await username.props.onPress()
  expect(useNavigation().navigate).toBeCalledTimes(1)
  expect(useNavigation().navigate).toBeCalledWith(routes.USER_PROFILE, { userId: 123 })
})

it('handles username not found', async () => {
  api.authors.getByUsername.mockReturnValueOnce([])
  const { wrapper } = givenFormatedTypography()
  const username = wrapper.root.findAllByProps({ children: infos.username })[0]
  await username.props.onPress()
  expect(useNavigation().navigate).not.toBeCalled()
})
