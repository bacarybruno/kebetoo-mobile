import { StyleSheet } from 'react-native';

import { metrics } from '@app/theme';

export default (colors) => StyleSheet.create({
  wrapper: {
    minWidth: 64,
    height: 36,
    paddingHorizontal: metrics.marginHorizontal,
    borderColor: colors.primary,
    borderRadius: metrics.radius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
