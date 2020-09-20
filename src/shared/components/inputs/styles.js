import { StyleSheet } from 'react-native'
import { human } from 'react-native-typography'

import { colors, metrics } from '@app/theme'

export const placeholderColor = colors.placeholder

export default StyleSheet.create({
  wrapper: {
    backgroundColor: colors.backgroundSecondary,
    minHeight: 48,
    borderColor: colors.border,
    borderRadius: 15,
    borderWidth: 1,
    paddingLeft: metrics.marginHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    ...human.callout,
    color: colors.textPrimary,
    flex: 1,
  },
  iconWrapper: {
    height: 48,
    width: 48,
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: placeholderColor,
  },
  popover: {
    backgroundColor: colors.background,
    paddingHorizontal: metrics.marginHorizontal,
    paddingVertical: metrics.marginHorizontal / 2,
  },
  error: {
    borderColor: colors.pink,
  },
  trailing: {
    paddingRight: 38,
  },
  emojiSelector: {
    marginTop: 15,
    width: metrics.screenWidth,
    marginLeft: -metrics.marginHorizontal,
    marginBottom: -10,
    display: 'flex',
    backgroundColor: colors.secondary,
  },
  hide: {
    display: 'none',
  },
  emojiPicker: {
    marginRight: 5,
  },
})
