import { StyleSheet } from 'react-native';

import { metrics } from '@app/theme';

export default StyleSheet.create({
  wrapper: {
    marginBottom: metrics.spacing.xxl,
  },
  noMargin: {
    marginBottom: 0,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.spacing.sm,
  },
  repostHeaderWrapper: {
    marginBottom: metrics.spacing.xs,
  },
  headerContent: {
    flexDirection: 'row',
  },
  left: {
    flex: 1,
    flexDirection: 'row',
  },
  meta: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: metrics.spacing.sm,
  },
  repostMeta: {
    justifyContent: 'center',
  },
  smallMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reactions: {
    marginTop: metrics.spacing.sm,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
});
