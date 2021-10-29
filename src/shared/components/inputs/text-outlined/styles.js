import { StyleSheet } from 'react-native';

import { metrics } from '@app/theme';

export default (colors) => StyleSheet.create({
  textInput: {
    paddingBottom: metrics.spacing.sm,
    color: colors.textPrimary,
  },
  textInputWrapper: {
    backgroundColor: colors.background,
    borderColor: 'transparent',
    borderRadius: 0,
  },
  label: {
    marginLeft: 0,
  },
  inputWrapper: {
    paddingLeft: 0,
  },
  border: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  error: {
    borderBottomColor: colors.danger,
  },
});
