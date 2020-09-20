import { StyleSheet } from 'react-native'

import { colors, metrics } from '@app/theme'

const safeHeight = metrics.screenHeight - metrics.headerHeight

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: metrics.marginHorizontal,
    paddingVertical: metrics.marginVertical,
  },
  scrollView: {
    flexGrow: 1,
  },
  normalSignUp: {
    height: safeHeight * 0.75,
    maxHeight: 380,
    justifyContent: 'space-between',
  },
  footerText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  keyboard: {
    backgroundColor: colors.background,
  },
})
