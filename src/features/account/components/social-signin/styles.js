import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

export default (colors) => StyleSheet.create({
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
  googleIcon: {
    width: 32,
    height: 33,
    marginHorizontal: metrics.marginHorizontal / 2,
  },
  facebookIconWrapper: {
    backgroundColor: colors.white,
    borderRadius: metrics.radius.md,
  },
})
