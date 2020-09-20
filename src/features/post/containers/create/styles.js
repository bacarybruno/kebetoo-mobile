import { StyleSheet } from 'react-native'

import { colors, metrics, elevation } from '@app/theme'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: metrics.marginVertical,
  },
  container: {
    flex: 1,
    marginHorizontal: metrics.marginHorizontal,
  },
  header: {
    backgroundColor: colors.background,
    ...elevation(0),
  },
  headerSaveButton: {
    marginHorizontal: metrics.marginHorizontal,
  },
  textInput: {
    textAlignVertical: 'top',
  },
  textInputWrapper: {
    marginTop: 8,
    backgroundColor: colors.backgroundSecondary,
    paddingRight: metrics.marginHorizontal,
  },
  textCount: {
    marginTop: 8,
  },
  buttonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: metrics.marginHorizontal,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  iconButton: {
    marginRight: metrics.marginHorizontal,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  audioPlayer: {
    borderRadius: 15,
    ...elevation(1),
  },
})
