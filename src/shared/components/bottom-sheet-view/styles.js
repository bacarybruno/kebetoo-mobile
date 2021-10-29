import { StyleSheet } from 'react-native';

import { metrics } from '@app/theme';

export default (colors) => StyleSheet.create({
  text: {
    color: colors.textPrimary,
    textAlign: 'center',
  },
  commentPanelHeader: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    height: 50,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: metrics.spacing.md,
  },
  modalCloseIcon: {
    position: 'absolute',
    right: metrics.spacing.md,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
