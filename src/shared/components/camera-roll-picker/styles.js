import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

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
  },
  modal: {
    position: 'absolute',
    backgroundColor: colors.background,
  },
  preview: {
    flex: 0.8,
  },
  previewDesc: {
    flex: 0.2,
    padding: 8,
    justifyContent: 'space-between',
  },
  flatlistColumn: {
    justifyContent: 'space-between',
    width: '100%',
  },
})
