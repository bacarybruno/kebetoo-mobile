import { StyleSheet } from 'react-native'
import Colors from '../../../../theme/colors'
import Metrics from '../../../../theme/metrics'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Metrics.marginHorizontal,
    paddingVertical: Metrics.marginVertical,
  },
  normalSignUp: {
    flex: 7,
    justifyContent: 'space-between',
  },
  socialSignUp: {
    flex: 3,
  },
  socialSignUpContainer: {
    justifyContent: 'space-between',
    height: '100%',
  },
  socialSignUpContent: {
    flex: 3,
    justifyContent: 'space-evenly',
  },
  footerText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'bottom',
    fontSize: 16,
  },
  linkButton: {
    color: Colors.secondary,
  },
  logo: {
    height: 115,
    width: 115,
    alignSelf: 'center',
    backgroundColor: 'grey',
  },
  hrLineText: {
    fontSize: 14,
  },
  socialSignUpButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialLoginButton: {
    marginHorizontal: Metrics.marginHorizontal / 2,
  },
})
