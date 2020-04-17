import { StyleSheet } from 'react-native'

import Metrics from 'Kebetoo/src/theme/metrics'

export default StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Metrics.marginHorizontal,
  },
  greetings: {
    flex: 8,
  },
  greetingTitle: {
    fontSize: 24,
  },
  greetingSubtitle: {
    fontSize: 14,
  },
})
