import { StyleSheet } from 'react-native';

import { metrics, elevation } from '@app/theme';
import { hexToRgba, rgbaToHex } from '@app/theme/colors';

export default (colors) => StyleSheet.create({
  button: {
    width: '100%',
    height: 48,
    backgroundColor: colors.primary,
    color: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: metrics.radius.mid,
    ...elevation(2),
  },
  disabledButton: {
    ...elevation(0),
    backgroundColor: hexToRgba(rgbaToHex(colors.primary), 0.30),
  },
  loading: {
    position: 'absolute',
    right: metrics.marginHorizontal,
  },
});
