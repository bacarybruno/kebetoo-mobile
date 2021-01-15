import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

const safeHeight = metrics.screenHeight - metrics.headerHeight

const termsHeight = 40 + metrics.spacing.xs
export default (colors) => StyleSheet.create({
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
    height: (safeHeight * 0.75) + termsHeight,
    maxHeight: 380 + termsHeight,
    justifyContent: 'space-between',
    // backgroundColor: 'red',
  },
  footerText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  keyboard: {
    backgroundColor: colors.background,
  },
  terms: {
    marginTop: metrics.spacing.sm,
    textAlign: 'center',
  },
})
