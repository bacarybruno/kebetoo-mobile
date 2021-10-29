import { StyleSheet } from 'react-native';

import { metrics } from '@app/theme';

export default (colors) => StyleSheet.create({
  deleteWrapper: {
    width: 22,
    height: 22,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: metrics.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 50,
  },
  searchHistoryButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: metrics.marginHorizontal,
  },
});
