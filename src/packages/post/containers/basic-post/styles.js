import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'

export default StyleSheet.create({
  wrapper: {
    marginBottom: 30,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  left: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  moreButton: {
    width: 30,
    alignItems: 'center',
  },
})
