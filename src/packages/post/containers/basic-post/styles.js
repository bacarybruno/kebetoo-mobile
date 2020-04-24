import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'

export default StyleSheet.create({
  wrapper: {
    marginBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  meta: {
    justifyContent: 'space-between',
    marginLeft: 5,
  },
  smallMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    backgroundColor: colors.input,
    minHeight: 52,
    padding: metrics.marginHorizontal,
    borderRadius: 5,
    justifyContent: 'center',
    marginBottom: 8,
  },
  reactions: {
    flexDirection: 'row',
  },
  reaction: {
    flexDirection: 'row',
    minWidth: 35,
    marginRight: 15,
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
})
