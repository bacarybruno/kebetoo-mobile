import { StyleSheet } from 'react-native'

import { metrics, elevation } from '@app/theme'
import Typography from '@app/shared/components/typography'

export default (colors) => StyleSheet.create({
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
    fontSize: Typography.fontSizes.md,
  },
  textInputWrapper: {
    marginTop: 8,
    backgroundColor: colors.backgroundSecondary,
    paddingRight: metrics.marginHorizontal,
    height: metrics.screenHeight / 3.5,
    minHeight: 200,
    paddingVertical: metrics.marginVertical / 4,
    borderColor: 'transparent',
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
  imagePreviewer: {
    width: '50%',
  },
})
