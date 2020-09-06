import setupTest from 'Kebetoo/src/config/jest-setup'
import authors from 'Kebetoo/__fixtures__/authors.json'

import Notification, { Dot, Title, Message } from '../index'

const givenNotification = setupTest(Notification)({
  isOpened: true,
  title: {
    name: 'Bruno',
    value: 'reacted to your post',
  },
  message: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumyod magna et dolore magna.',
  caption: '2 days ago',
  author: authors[0],
  onPress: jest.fn(),
})

it('renders Notification', () => {
  const { wrapper } = givenNotification()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

describe('conditional renders', () => {
  it('shows notification dot if not opened', () => {
    const { wrapper } = givenNotification({ isOpened: false })
    expect(wrapper.root.findAllByType(Dot).length).toBe(1)
  })

  it('doesnt show title if not present', () => {
    const { wrapper } = givenNotification({ title: null })
    expect(wrapper.root.findAllByType(Title).length).toBe(0)
  })

  it('doesnt show message if not present', () => {
    const { wrapper } = givenNotification({ message: null })
    expect(wrapper.root.findAllByType(Message).length).toBe(0)
  })
})
