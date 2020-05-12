import { StyleSheet } from 'react-native'
import colors from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: metrics.marginHorizontal,
    paddingVertical: metrics.marginVertical,
  },
  normalSignUp: {
    flex: 3,
    maxHeight: 360,
    justifyContent: 'space-between',
  },
  footerText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'bottom',
  },
  forgotPassword: {
    textAlign: 'right',
    marginTop: 10,
  },
})
