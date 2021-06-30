import { StyleSheet } from 'react-native';

import { metrics } from '@app/theme';

export default (colors) => StyleSheet.create({
  draggableContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  draggableIcon: {
    width: 40,
    height: 8,
    borderRadius: metrics.radius.sm,
    backgroundColor: colors.inactive,
    margin: metrics.spacing.sm + 2,
  },
});
