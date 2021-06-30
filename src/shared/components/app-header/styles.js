import { StyleSheet } from 'react-native';

import { metrics } from '@app/theme';

import Typography from '../typography';

export default StyleSheet.create({
  header: {
    height: metrics.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetings: {
    flex: 8,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loading: {
    marginLeft: metrics.spacing.sm,
  },
  icon: {
    width: Typography.fontSizes.header,
    height: Typography.fontSizes.header,
    marginLeft: metrics.spacing.xs,
  },
  headerBack: {
    marginLeft: 0,
    marginRight: metrics.spacing.md,
  },
  title: {
    flex: 1,
    // TODO: text shadow and icon shadow
  },
  headerAvatar: {
    marginLeft: metrics.spacing.sm,
  },
});
