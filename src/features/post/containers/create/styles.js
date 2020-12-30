import { Platform, StyleSheet } from 'react-native'
import { human, systemWeights } from 'react-native-typography'

import { metrics, elevation } from '@app/theme'
import Typography from '@app/shared/components/typography'

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    marginHorizontal: metrics.marginHorizontal,
    marginBottom: metrics.marginVertical,
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
    ...human.headline,
    ...systemWeights.regular,
    fontSize: Typography.fontSizes.md + 3,
    color: colors.textPrimary,
    marginTop: Platform.select({ android: -10, default: 0 }),
  },
  textInputWrapper: {
    backgroundColor: colors.background,
    height: metrics.screenHeight / 3.5,
    minHeight: 200,
    borderColor: 'transparent',
    borderRadius: 0,
  },
  textCount: {
    marginLeft: 5,
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
  inputWrapper: {
    paddingLeft: 0,
  },
})
