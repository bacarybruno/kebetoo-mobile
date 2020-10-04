import setupTest from '@app/config/jest-setup'

import ReplyInfo, { DeleteIconButton } from '../index'

const givenReplyInfo = setupTest(ReplyInfo)({
  info: {
    content: 'A comment reply',
    author: {
      displayName: 'Bruno',
    },
  },
  size: 20,
  onClose: jest.fn(),
})

it('renders ReplyInfo', () => {
  const { wrapper } = givenReplyInfo()
  expect(wrapper.toJSON()).toMatchSnapshot()
})

it('closes reply info', () => {
  const { wrapper, props } = givenReplyInfo()
  wrapper.root.findByType(DeleteIconButton).props.onPress()
  expect(props.onClose).toBeCalledTimes(1)
})
