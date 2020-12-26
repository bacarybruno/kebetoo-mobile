import { elevation, metrics } from '@app/theme'
import { StyleSheet } from 'react-native'

const height = 40
const borderRadius = height / 2
export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    height,
    maxHeight: height,
    flexDirection: 'row',
    ...elevation(1),
  },
  item: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: metrics.marginHorizontal,
  },
  selected: {
    backgroundColor: colors.primary,
    ...elevation(4),
    paddingHorizontal: metrics.marginHorizontal * 1.5,
  },
  bordered: {
    borderTopLeftRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
  },
})
