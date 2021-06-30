import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'
import iosColors from '@app/theme/ios-colors'
import { iconSize } from '@app/features/stories/components/actions-bar/styles'

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: iosColors.systemBackground.dark,
  },
  text: {
    color: colors.white,
  },
  textShadow: {
    shadowOpacity: 2,
    textShadowRadius: 1,
    textShadowOffset: { width: 1, height: 1 },
  },
  padding: {
    paddingHorizontal: metrics.marginHorizontal,
  },
  videoIcon: {
    width: iconSize * 1.2,
    height: iconSize * 1.2,
    borderColor: colors.border,
    borderWidth: 1,
  },
})
