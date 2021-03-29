import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

let safeHeight = metrics.screenHeight - metrics.headerHeight
if (metrics.isIPhoneX) {
  safeHeight -= metrics.screenHeight * 0.1
}

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
