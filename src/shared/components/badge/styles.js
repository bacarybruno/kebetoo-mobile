import { StyleSheet } from 'react-native';

import { metrics } from '@app/theme';

export default StyleSheet.create({
  wrapper: {
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: metrics.spacing.xs,
    borderRadius: metrics.radius.round,
  },
});
