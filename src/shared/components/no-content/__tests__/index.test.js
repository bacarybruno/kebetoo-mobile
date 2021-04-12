import setupTest from '@app/config/jest-setup'
import { strings } from '@app/config'

import NoContent from '../index'
import Typography from '../../typography'


const givenNoContent = setupTest(NoContent)({
  title: strings.general.no_content,
  text: strings.comments.no_content,
  children: <Typography type={Typography.types.body} text="child" />,
})

it('renders NoContent', () => {
  const { wrapper } = givenNoContent()
  expect(wrapper.toJSON()).toMatchSnapshot()
})
