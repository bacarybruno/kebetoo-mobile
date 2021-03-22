import setupTest from '@app/config/jest-setup'

import ParsedTypography from '../index'

const givenParsedTypography = setupTest(ParsedTypography)({
  text: `
    Hello World!
    Here is a *bold* text 
    Here is a _italic_ italic 
    Here is a ~strikeThrough~ text 
    Made with love by @bacary
    #kebetoo
  `,
  numberOfLines: 2,
})

it('renders ParsedTypography', () => {
  const { wrapper } = givenParsedTypography()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
