import { StyleSheet } from 'react-native'

import { elevation, metrics } from '@app/theme'

export const paddingHorizontal = metrics.marginHorizontal * 1.5
export const bottomBarSize = 45

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
  post: {
    width: '100%',
    backgroundColor: colors.backgroundSecondary,
    paddingTop: metrics.marginHorizontal,
  },
  postHeader: {
    minHeight: metrics.screenHeight * 0.15,
  },
  content: {
    marginBottom: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    padding: metrics.marginHorizontal,
    paddingTop: 0,
  },
  headerBack: {
    width: 24,
    height: 24,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
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
  backHandler: {
    width: 24,
    height: 24,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
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
  headerBackButton: {
    width: metrics.spacing.xl,
    paddingVertical: metrics.spacing.sm,
    alignItems: 'flex-start'
  },
})
