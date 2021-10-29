import { StyleSheet } from 'react-native';

import { metrics } from '@app/theme';

export default (colors) => StyleSheet.create({
  roomWrapper: {
    paddingVertical: metrics.spacing.md,
    flexDirection: 'row',
    paddingHorizontal: metrics.marginHorizontal,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  roomInfos: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: metrics.spacing.md,
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
  pendingRoom: {
    backgroundColor: colors.secondary,
  },
});
