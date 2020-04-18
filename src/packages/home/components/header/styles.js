import { StyleSheet } from 'react-native'

import metrics from 'Kebetoo/src/theme/metrics'

export default StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: metrics.marginHorizontal,
  },
  greetings: {
    flex: 8,
  },
})
