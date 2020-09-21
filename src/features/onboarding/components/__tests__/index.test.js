import setupTest from '@app/config/jest-setup'
import strings from '@app/config/strings'

import OnboardingSlide from '../index'

const givenOnboardingSlide = setupTest(OnboardingSlide)()

it('renders OnboardingSlide', () => {
  const { wrapper } = givenOnboardingSlide({
    slideTitle: strings.onboarding.screen_one_title,
    slideDescription: strings.onboarding.screen_one_description,
    imageSrc: {
      uri: 'https://avatars1.githubusercontent.com/u/14147533',
    },
  })
  expect(wrapper.toJSON()).toMatchSnapshot()
})