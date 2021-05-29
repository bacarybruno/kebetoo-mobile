import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'
import iosColors from '@app/theme/ios-colors'

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: iosColors.systemBackground.dark,
  },
  video: {
    flex: 1,
  },
  previewHeader: {
    width: metrics.screenWidth,
    paddingHorizontal: metrics.marginHorizontal,
    position: 'absolute',
    top: 0,
    zIndex: 1000,
  },
  viewshot: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  panelHeader: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    height: 50,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  modalCloseIcon: {
    position: 'absolute',
    right: metrics.spacing.md,
  },
  panelWrapper: {
    backgroundColor: colors.background,
  },
  sticker: {
    flex: 1,
    height: 100,
    margin: metrics.spacing.xs / 2,
  },
  stickerImage: {
    width: '100%',
    height: '100%',
  },
})