import { StyleSheet } from 'react-native'

import metrics from 'Kebetoo/src/theme/metrics'
import colors from 'Kebetoo/src/theme/colors'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: metrics.marginHorizontal * 2,
  },
  title: {
    fontSize: 40,
    marginBottom: 10,
  },
  message: {
    textAlign: 'center',
  },
})
