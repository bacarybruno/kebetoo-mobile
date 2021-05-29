import { StyleSheet } from 'react-native'

import { elevation, metrics } from '@app/theme'

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  flexible: {
    flex: 1,
  },
  flatlistContent: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  comment: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
  swipeable: {
    paddingHorizontal: metrics.marginHorizontal,
    paddingTop: metrics.marginHorizontal,
    paddingBottom: metrics.marginHorizontal / 2,
    justifyContent: 'center',
  },
  swipeableReply: {
    paddingLeft: metrics.marginHorizontal,
    paddingTop: metrics.marginHorizontal / 2,
    paddingBottom: metrics.marginHorizontal / 2,
    justifyContent: 'center',
  },
  replyWrapper: {
    paddingLeft: metrics.marginHorizontal * 3,
    paddingRight: metrics.marginHorizontal,
  },
  selectedComment: {
    backgroundColor: colors.backgroundSecondary,
    ...elevation(1),
  },
  keyboard: {
    backgroundColor: colors.background,
  },
})
