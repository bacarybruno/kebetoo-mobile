import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

export default (colors) => StyleSheet.create({
  notificationWrapper: {
    paddingVertical: metrics.spacing.md,
    flexDirection: 'row',
    paddingHorizontal: metrics.marginHorizontal,
  },
  notificationInfos: {
    justifyContent: 'center',
    marginLeft: metrics.spacing.md,
    flex: 1,
  },
  notificationCaption: {
    marginTop: metrics.spacing.xs / 2,
  },
  headerTitleWrapper: {
    flexDirection: 'row',
  },
  headerTitle: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: metrics.spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: metrics.radius.round,
    marginTop: metrics.spacing.sm,
    marginLeft: metrics.spacing.xs,
    backgroundColor: colors.primary,
  },
  captionWrapper: {
    flex: 1,
  },
  pendingNotification: {
    backgroundColor: colors.secondary,
  },
})
