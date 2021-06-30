import { StyleSheet } from 'react-native';
import { human } from 'react-native-typography';

import { metrics } from '@app/theme';

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerSaveButton: {
    marginHorizontal: metrics.marginHorizontal,
  },
  saveButton: {
    width: 40,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.textPrimary,
    height: '100%',
    paddingTop: '80%',
    ...human.body,
  },
  modal: {
    position: 'absolute',
    backgroundColor: colors.backgroundSecondary,
    width: '100%',
  },
  preview: {
    flex: 0.8,
  },
  previewDesc: {
    flex: 0.2,
    padding: metrics.spacing.sm,
    justifyContent: 'space-around',
  },
  flatlistColumn: {
    justifyContent: 'space-between',
    width: '100%',
  },
  albumsContent: {
    paddingTop: 0,
  },
});
