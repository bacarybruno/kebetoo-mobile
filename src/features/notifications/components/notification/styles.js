import { StyleSheet } from 'react-native'

import { colors, metrics } from '@app/theme'

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
    marginBottom: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginLeft: 5,
    backgroundColor: colors.primary,
  },
  captionWrapper: {
    flex: 1,
  },
})
