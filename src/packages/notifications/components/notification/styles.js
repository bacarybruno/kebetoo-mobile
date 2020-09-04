import { StyleSheet } from 'react-native'

import metrics from 'Kebetoo/src/theme/metrics'
import colors from 'Kebetoo/src/theme/colors'

export default StyleSheet.create({
  notificationWrapper: {
    paddingVertical: 14,
    flexDirection: 'row',
    paddingHorizontal: metrics.marginHorizontal,
  },
  notificationInfos: {
    justifyContent: 'center',
    marginLeft: 12,
    flex: 1,
  },
  notificationCaption: {
    marginTop: 2,
  },
  headerTitleWrapper: {
    flexDirection: 'row',
  },
  headerTitle: {
    flex: 1,
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    backgroundColor: colors.primary,
  },
  captionWrapper: {
    flex: 1,
  },
})
