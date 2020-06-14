import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'
import elevation from 'Kebetoo/src/theme/elevation'

export default StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },
  text: {
    marginBottom: 8,
  },
  iconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.inactive,
    marginLeft: metrics.marginHorizontal,
    ...elevation(2),
  },
  audioWrapper: {
    backgroundColor: colors.input,
    maxHeight: 52,
    height: 52,
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    flex: 1,
  },
  progress: {
    position: 'absolute',
    backgroundColor: colors.inactive,
    opacity: 0.4,
    height: '100%',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  round: {
    borderTopLeftRadius: 26,
    borderBottomLeftRadius: 26,
    borderRadius: 26,
  },
  wavesContainer: {
    alignItems: 'center',
    flex: 1,
  },
  waves: {
    width: '80%',
    resizeMode: 'contain',
  },
  deleteWrapper: {
    width: 20,
    height: 20,
    backgroundColor: colors.inactive,
    position: 'absolute',
    top: -5,
    right: -5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    ...elevation(2),
  },
  duration: {
    position: 'absolute',
    right: 5,
    bottom: 2,
  },
})
