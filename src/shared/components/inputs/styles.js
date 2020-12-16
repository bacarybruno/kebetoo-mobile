import { StyleSheet } from 'react-native'
import { human } from 'react-native-typography'

import { metrics } from '@app/theme'

export default (colors) => StyleSheet.create({
  wrapper: {
    backgroundColor: colors.backgroundSecondary,
    minHeight: 48,
    borderColor: colors.border,
    borderRadius: 15,
    borderWidth: 1,
    overflow: 'hidden',
  },
  textInput: {
    ...human.callout,
    color: colors.textPrimary,
    flex: 1,
    height: '100%',
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
    color: colors.placeholder,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: metrics.marginHorizontal,
    flex: 1,
  },
})
