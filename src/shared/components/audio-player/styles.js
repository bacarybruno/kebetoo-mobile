import { StyleSheet } from 'react-native';

import { metrics, elevation } from '@app/theme';

export default (colors) => StyleSheet.create({
  wavesContainer: {
    alignItems: 'center',
    flex: 1,
  },
  waves: {
    width: '80%',
    resizeMode: 'contain',
  },
  iconWrapper: {
    width: 30,
    height: 30,
    borderRadius: metrics.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    marginLeft: metrics.marginHorizontal,
    ...elevation(2),
  },
  deleteWrapper: {
    width: 20,
    height: 20,
    backgroundColor: colors.backgroundSecondary,
    position: 'absolute',
    top: -5,
    right: -5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: metrics.radius.round,
    ...elevation(2),
  },
  audio: {
    flex: 1,
    maxHeight: 52,
    height: 52,
  },
  audioWrapper: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: metrics.radius.sm,
    backgroundColor: colors.backgroundSecondary,
  },
  audioContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  round: {
    borderRadius: metrics.radius.lg,
  },
  progress: {
    position: 'absolute',
    backgroundColor: colors.inactive,
    opacity: 0.4,
    height: '100%',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  duration: {
    position: 'absolute',
    right: 8,
    bottom: 2,
  },
});
