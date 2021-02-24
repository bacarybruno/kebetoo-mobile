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
    paddingHorizontal: metrics.marginHorizontal,
  },
  textInput: {
    textAlignVertical: 'top',
    ...human.headline,
    ...systemWeights.regular,
    fontSize: Typography.fontSizes.md + 3,
    color: colors.textPrimary,
  },
  textInputWrapper: {
    height: metrics.screenHeight / 3.5,
    minHeight: 200,
  },
  textCount: {
    marginLeft: Platform.select({ android: metrics.spacing.xs, ios: 0 }),
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
    borderRadius: metrics.radius.md,
    ...elevation(1),
  },
  imagePreviewer: {
    width: '50%',
  },
  postTextMessage: {
    marginTop: metrics.screenHeight * 0.02,
  },
  videoMarker: {
    position: 'absolute',
    left: 10,
    bottom: 5,
  },
})
