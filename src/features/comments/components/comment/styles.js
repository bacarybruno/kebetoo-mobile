import { StyleSheet } from 'react-native'

import { colors } from '@app/theme'

export const bottomBarSize = 45
export default StyleSheet.create({
  flexible: {
    flex: 1,
  },
  audio: {
    marginTop: 5,
    backgroundColor: colors.backgroundSecondary,
  },
  reactionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  reactionsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
    paddingHorizontal: 5,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  avatarWrapper: {
    marginRight: 10,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
})
