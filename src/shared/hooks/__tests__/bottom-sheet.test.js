import { setupHook } from '@app/config/jest-setup'
import { useActionSheet } from '@expo/react-native-action-sheet'
import useBottomSheet from '../bottom-sheet'

jest.mock('@expo/react-native-action-sheet', () => ({
  useActionSheet: jest.fn().mockReturnValue({
    showActionSheetWithOptions: jest.fn().mockImplementation((props, callback) => callback(0)),
  }),
}))

beforeEach(jest.clearAllMocks)

const givenBottomSheet = () => {
  const rendered = setupHook(useBottomSheet)
  return { bottomSheet: rendered.result.current, rerender: rendered.rerender }
}

it('showManagePostsOptions', async () => {
  const { bottomSheet } = givenBottomSheet()
  await bottomSheet.showManagePostsOptions()
  expect(useActionSheet().showActionSheetWithOptions.mock.calls[0]).toMatchSnapshot()
})

it('showSharePostOptions', async () => {
  const { bottomSheet } = givenBottomSheet()
  await bottomSheet.showSharePostOptions()
  expect(useActionSheet().showActionSheetWithOptions.mock.calls[0]).toMatchSnapshot()
})

it('showAppearanceOptions', async () => {
  const { bottomSheet } = givenBottomSheet()
  await bottomSheet.showAppearanceOptions()
  expect(useActionSheet().showActionSheetWithOptions.mock.calls[0]).toMatchSnapshot()
})

it('showAvatarOptions', async () => {
  const { bottomSheet } = givenBottomSheet()
  await bottomSheet.showAvatarOptions()
  expect(useActionSheet().showActionSheetWithOptions.mock.calls[0]).toMatchSnapshot()
})

it('showFeedPostsOptions', async () => {
  const { bottomSheet } = givenBottomSheet()
  await bottomSheet.showFeedPostsOptions({
    author: {
      displayName: 'Bruno',
    },
  })
  expect(useActionSheet().showActionSheetWithOptions.mock.calls[0]).toMatchSnapshot()
})
