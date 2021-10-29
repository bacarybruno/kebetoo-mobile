import { StyleSheet } from 'react-native';

import { metrics } from '@app/theme';

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: metrics.marginHorizontal,
  },
  item: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingVertical: metrics.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    right: 0,
  },
});
