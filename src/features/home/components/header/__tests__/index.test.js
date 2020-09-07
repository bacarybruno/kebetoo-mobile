import setupTest from '@app/config/jest-setup'

import Badge from '../index'

const givenBadge = setupTest(Badge)()

it('renders Badge', () => {
  const { wrapper } = givenBadge({
    displayName: 'Bruno Bodian',
    imageSrc: 'https://avatars1.githubusercontent.com/u/14147533',
    style: {
      backgroundColor: 'red',
    },
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})
