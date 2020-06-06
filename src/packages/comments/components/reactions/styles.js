import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'

export const paddingHorizontal = metrics.marginHorizontal * 1.5
export const borderRadiusSize = 35
export const summaryHeight = 30
export const bottomBarSize = 45
export const reactionsHeight = borderRadiusSize + 20
export const imgSize = 28

export default StyleSheet.create({
  reactionsContainer: {
    borderTopLeftRadius: borderRadiusSize,
    borderTopRightRadius: borderRadiusSize,
    paddingHorizontal,
    backgroundColor: colors.background,
  },
  summary: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  reactions: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imgs: {
    flexDirection: 'row',
    marginRight: 5,
  },
  imgWrapper: {
    width: imgSize,
    height: imgSize,
    backgroundColor: colors.background,
    borderRadius: imgSize / 2,
    padding: 2,
    zIndex: 1,
  },
  img: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: imgSize / 2,
  },
  img2Wrapper: {
    marginLeft: -imgSize / 2.5,
    zIndex: 0,
  },
})
