import { StyleSheet } from 'react-native';

import { elevation, metrics } from '@app/theme';
import iosColors from '@app/theme/ios-colors';
import { hexToRgba, rgbaToHex } from '@app/theme/colors';

export const borderRadius = metrics.radius.md;
export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    aspectRatio: metrics.aspectRatio.square,
    borderRadius,
    backgroundColor: colors.inactive,
    ...elevation(1),
  },
  thumbnail: {
    flex: 1,
    borderRadius,
  },
  touchableOverlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  touchable: {
    width: 70,
    height: 70,
    borderRadius: metrics.radius.round,
    backgroundColor: hexToRgba(rgbaToHex(iosColors.systemBackground.dark), 0.5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: metrics.spacing.xs,
    zIndex: 1,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
  },
  badge: {
    backgroundColor: hexToRgba(rgbaToHex(iosColors.systemBackground.dark), 0.5),
    borderColor: colors.border,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  defaultVideo: {
    width: 0,
    height: 0,
  },
});
