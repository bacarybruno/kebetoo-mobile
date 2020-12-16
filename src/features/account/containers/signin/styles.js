import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

const safeHeight = metrics.screenHeight - metrics.headerHeight

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
  normalSignIn: {
    height: safeHeight * 0.75,
    maxHeight: 360,
    justifyContent: 'space-between',
  },
  footerText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  forgotPassword: {
    textAlign: 'right',
    marginTop: 10,
  },
  keyboard: {
    backgroundColor: colors.background,
  },
})
