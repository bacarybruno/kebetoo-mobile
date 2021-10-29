import { StyleSheet } from 'react-native';

import { metrics } from '@app/theme';

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    minHeight: 52,
    marginVertical: metrics.spacing.sm,
    borderLeftWidth: 2,
    borderColor: colors.border,
    paddingLeft: metrics.marginHorizontal / 2,
  },
  imageContent: {
    paddingLeft: 0,
    borderLeftWidth: 0,
  },
});
