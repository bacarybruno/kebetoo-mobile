import setupTest from 'Kebetoo/src/config/jest-setup'

import Avatar from '../index'

const givenAvatar = setupTest(Avatar)({
  size: 20,
  fontSize: 20,
})

it('renders an Avatar with text', () => {
  const { wrapper } = givenAvatar({
    text: 'Bruno Bodian',
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('renders an Avatar with image', () => {
  const { wrapper } = givenAvatar({
    src: 'https://avatars1.githubusercontent.com/u/14147533',
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('displays TextAvatar if no image source is provided', () => {
  const { wrapper, props } = givenAvatar({
    text: 'Bruno Bodian',
    src: undefined,
  })
  const firstLetter = props.text[0]
  expect(wrapper.queryAllByText(firstLetter)).toHaveLength(1)
})

it('displays ImageAvatar if an image source is provided', () => {
  const { wrapper, props } = givenAvatar({
    text: 'Bruno Bodian',
    src: 'https://avatars1.githubusercontent.com/u/14147533',
  })
  const firstLetter = props.text[0]
  expect(wrapper.queryAllByTestId(`image-avatar-${props.src}`)).toHaveLength(1)
  expect(wrapper.queryAllByText(firstLetter)).toHaveLength(0)
})
