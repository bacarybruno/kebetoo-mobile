import { StyleSheet } from 'react-native'
import { human } from 'react-native-typography'

import { metrics } from '@app/theme'
import { hexToRgba, rgbaToHex } from '@app/theme/colors'

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
    paddingBottom: metrics.spacing.md,
  },
  content: {
    paddingHorizontal: metrics.marginHorizontal,
  },
  inputWrapper: {
    flex: 1,
    marginBottom: metrics.spacing.xl,
    maxWidth: 300,
    width: '90%',
    alignSelf: 'center'
  },
  saveButton: {
    marginBottom: metrics.marginVertical,
  },
  label: {
    marginTop: metrics.spacing.lg,
    marginBottom: metrics.spacing.md,
  },
  textInputWrapper: {
    flex: 1,
    borderColor: 'transparent',
    borderRadius: 0,
    backgroundColor: colors.background,
  },
  textInput: {
    ...human.headlineObject,
    color: colors.textPrimary,
    fontWeight: 'normal',
  },
  flatlistColumn: {
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.xxl * 1.5,
  },
  flstlistContent: {
    justifyContent: 'space-between',
  },
  roomName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioWrapper: {
    height: 45,
    margin: metrics.spacing.sm,
    width: metrics.screenWidth / 1.5,
  },
  audio: {
    backgroundColor: hexToRgba(rgbaToHex(colors.black), 0.05),
  },
  onlineDot: {
    backgroundColor: colors.green,
    borderRadius: metrics.radius.round,
    width: 10,
    height: 10,
    marginLeft: metrics.spacing.xs,
    marginTop: 3,
  }
})
