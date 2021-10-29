import { StyleSheet } from 'react-native';

import { metrics } from '@app/theme';
import { hexToRgba, rgbaToHex } from '@app/theme/colors';

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: metrics.marginHorizontal,
  },
  content: {
    marginBottom: metrics.marginVertical,
  },
  avatarOverlay: {
    backgroundColor: hexToRgba(rgbaToHex(colors.black), 0.4),
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarOverlayIcon: {
    color: colors.white,
  },
  section: {
    marginTop: metrics.spacing.md,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.md,
  },
});
