import { StyleSheet } from 'react-native'

import { colors, metrics } from '@app/theme'
import { fontSizes } from '../typography'

export const numColumns = 8
export const emojiSize = metrics.screenWidth / numColumns

export default StyleSheet.create({
  wrapper: {
    backgroundColor: colors.backgroundSecondary,
  },
  emojiTabs: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.backgroundSecondary,
  },
  tabEmojiSymbol: {
    fontSize: fontSizes.header,
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabContent: {
    width: metrics.screenWidth,
  },
  emoji: {
    width: emojiSize,
    height: emojiSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiSymbol: {
    fontSize: fontSizes.xl,
  },
})
