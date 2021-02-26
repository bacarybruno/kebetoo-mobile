import setupTest from '@app/config/jest-setup'

import LanguagesPage from '../index'

beforeEach(jest.clearAllMocks)

const givenLanguagesPage = setupTest(LanguagesPage)()

it('renders LanguagesPage', () => {
  const { wrapper } = givenLanguagesPage()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
