import { StyleSheet } from 'react-native';
import { systemWeights } from 'react-native-typography';

import { metrics } from '@app/theme';

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  textInputWrapper: {
    borderColor: 'transparent',
    backgroundColor: colors.backgroundSecondary,
    paddingLeft: 0,
    margin: metrics.spacing.md,
    borderRadius: metrics.radius.sm,
  },
  textInputStyle: {
    ...systemWeights.regular,
    fontSize: 18,
    flex: 1,
  },
  cancelIcon: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: metrics.spacing.md,
  },
  segmentedControl: {
    marginHorizontal: metrics.marginHorizontal,
    marginBottom: metrics.spacing.sm,
  },
});
