import { StyleSheet } from 'react-native'

import colors from '@app/theme/colors'
import metrics from '@app/theme/metrics'
import elevation from '@app/theme/elevation'

export default StyleSheet.create({
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
    borderRadius: 15,
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
    borderRadius: 15,
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
    borderRadius: 5,
    backgroundColor: colors.backgroundSecondary,
  },
  audioContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  round: {
    borderRadius: 22,
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
})
