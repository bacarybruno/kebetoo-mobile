import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'

export const borderRadiusSize = 55
export const paddingHorizontal = metrics.marginHorizontal * 1.5
export const bottomBarSize = 45

export default StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  flexible: {
    flex: 1,
  },
  reactionsContainer: {
    height: borderRadiusSize,
    borderTopLeftRadius: borderRadiusSize,
    borderTopRightRadius: borderRadiusSize,
    paddingHorizontal,
    backgroundColor: colors.background,
  },
  reactions: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  flatlistContent: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  post: {
    width: '100%',
    minHeight: metrics.screenHeight * 0.2,
    backgroundColor: colors.input,
    paddingTop: metrics.marginHorizontal,
    marginBottom: metrics.marginHorizontal,
  },
  content: {
    marginBottom: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    padding: metrics.marginHorizontal,
    paddingTop: 0,
  },
  commentInputWrapper: {
    backgroundColor: colors.background,
    paddingHorizontal: metrics.marginHorizontal,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  textInputSize: {
    height: bottomBarSize,
    minHeight: bottomBarSize,
  },
  textInputWrapper: {
    borderRadius: 100,
  },
  draggableContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  draggableIcon: {
    width: 100,
    height: 5,
    borderRadius: 5,
    margin: 10,
    backgroundColor: colors.inactive,
  },
  headerBack: {
    width: 24,
    height: 24,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comment: {
    marginHorizontal: paddingHorizontal,
    paddingVertical: metrics.marginHorizontal,
    borderTopColor: 'rgba(0, 0, 0, 0.07)',
    borderTopWidth: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  send: {
    width: bottomBarSize,
    height: bottomBarSize,
    borderRadius: bottomBarSize / 2,
    backgroundColor: colors.input,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // elevation
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  sendIcon: {
    marginLeft: bottomBarSize / 9,
    color: colors.primary,
  },
  backHandler: {
    width: 24,
    height: 24,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  loveIcon: {
    paddingLeft: 10,
  },
})
