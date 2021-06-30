import { StyleSheet } from 'react-native';

import { metrics } from '@app/theme';

export const paddingHorizontal = metrics.marginHorizontal * 1.5;
export const borderRadiusSize = metrics.radius.xl;
export const summaryHeight = 35;
export const bottomBarSize = 45;
export const reactionsHeight = borderRadiusSize + 30;
export const imgSize = 28;

export default (colors) => StyleSheet.create({
  reactionsContainer: {
    borderTopLeftRadius: borderRadiusSize,
    borderTopRightRadius: borderRadiusSize,
    paddingHorizontal,
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderLeftColor: colors.border,
    borderRightColor: colors.border,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  summary: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  reactions: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  imgs: {
    flexDirection: 'row',
    marginRight: metrics.spacing.xs,
  },
  imgWrapper: {
    width: imgSize,
    height: imgSize,
    backgroundColor: colors.background,
    borderRadius: metrics.radius.round,
    padding: metrics.spacing.xs / 2,
    zIndex: 1,
  },
  img: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: metrics.radius.round,
  },
  img2Wrapper: {
    marginLeft: -imgSize / 2.5,
    zIndex: 0,
  },
});
