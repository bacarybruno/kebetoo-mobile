import setupTest from 'Kebetoo/src/config/jest-setup'

import Onboarding from '../index'

const givenOnboarding = setupTest(Onboarding)()

it('renders Onboarding', () => {
  const { wrapper } = givenOnboarding({
    slideTitle: 'Kebetoo is gonna change the way your communicate',
    slideDescription: 'Just wait for it!',
    imageSrc: 'https://avatars1.githubusercontent.com/u/14147533',
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})
