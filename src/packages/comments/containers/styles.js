import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'

export const paddingHorizontal = metrics.marginHorizontal * 1.5
export const bottomBarSize = 45

export default StyleSheet.create({
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
})
