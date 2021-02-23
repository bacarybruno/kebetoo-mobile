import { Platform, StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

export default (colors) => StyleSheet.create({
  textInput: {
    marginTop: Platform.select({ android: -metrics.spacing.sm, default: 0 }),
    color: colors.textPrimary,
  },
  textInputWrapper: {
    backgroundColor: colors.background,
    borderColor: 'transparent',
    borderRadius: 0,
  },
  label: {
    marginLeft: Platform.select({ android: metrics.spacing.xs, ios: 0 }),
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
})
