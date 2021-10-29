import { StyleSheet } from 'react-native';

import { metrics } from '@app/theme';

export default (colors) => StyleSheet.create({
  recordButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    alignContent: 'center',
    zIndex: 2,
  },
  recordButton: {
    width: 70,
    height: 70,
    marginBottom: metrics.spacing.xxl,
    borderColor: colors.border,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: metrics.radius.round,
  },
  recordButtonContent: {
    width: 50,
    height: 50,
    backgroundColor: colors.danger,
    borderRadius: metrics.radius.round,
  },
});
