import { StyleSheet } from 'react-native'
import { human } from 'react-native-typography'

import { metrics } from '@app/theme'
import { hexToRgba, rgbaToHex } from '@app/theme/colors'
import mdColors from '@app/theme/md-colors'

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
    alignSelf: 'center',
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
    margin: metrics.spacing.sm,
    width: metrics.screenWidth / 1.5,
  },
  audio: {
    backgroundColor: hexToRgba(rgbaToHex(colors.teal), 0.2),
  },
  incomingAudio: {
    backgroundColor: hexToRgba(rgbaToHex(colors.backgroundTertiary), 0.5),
  },
  onlineDot: {
    backgroundColor: colors.green,
    borderRadius: metrics.radius.round,
    width: 8,
    height: 8,
    marginLeft: metrics.spacing.xs,
    marginTop: 3,
  },
  headerMenu: {
    minWidth: 250,
    paddingVertical: metrics.spacing.xs,
    paddingHorizontal: metrics.marginHorizontal,
  },
  popover: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: metrics.radius.sm,
  },
  bubbleLeftText: {
    color: colors.textPrimary,
  },
  bubbleRightText: {
    color: mdColors.textPrimary.dark,
  },
  bubbleLeftTimeText: {
    color: colors.textSecondary,
  },
  bubbleRightTimeText: {
    color: mdColors.textSecondary.dark,
  },
  bubbleLeftWrapper: {
    backgroundColor: colors.backgroundSecondary,
  },
  popoverArrowStyle: {
    width: 0,
    height: 0,
  },
  messageText: {
    marginHorizontal: metrics.spacing.sm,
    marginVertical: metrics.spacing.xs,
  }
})
