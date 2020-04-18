import { StyleSheet } from 'react-native'

import metrics from 'Kebetoo/src/theme/metrics'

export default StyleSheet.create({
  socialSignUp: {
    flex: 1,
  },
  socialSignUpContainer: {
    justifyContent: 'space-between',
    height: '100%',
  },
  socialSignUpContent: {
    flex: 3,
    justifyContent: 'space-evenly',
  },
  socialSignUpButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialLoginButton: {
    marginHorizontal: metrics.marginHorizontal / 2,
  },
})
