import { StyleSheet } from 'react-native';
import { metrics } from '@app/theme';

export const size = 56;
export default (colors) => StyleSheet.create({
  flex: {
    flex: 1,
  },
  wrapper: {
    width: size,
    height: size,
    bottom: metrics.tabBarHeight / 4,
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1000,
  },
  fab: {
    fontSize: 30,
  },
  iconButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: metrics.marginHorizontal / 2,
    paddingHorizontal: metrics.marginHorizontal,
  },
  iconButtonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButtonTitle: {
    marginBottom: metrics.spacing.xs / 2,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: metrics.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    marginRight: metrics.spacing.md,
  },
  iconButtonWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
