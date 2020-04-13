import { StyleSheet } from 'react-native'

import Metrics from 'Kebetoo/src/theme/metrics'

export const placeholderColor = '#ACACAC'

export default StyleSheet.create({
  wrapper: {
    backgroundColor: '#F2F2F2',
    height: 48,
    borderColor: '#E8E8E8',
    borderRadius: 15,
    borderWidth: 1,
    paddingLeft: Metrics.marginHorizontal,
  },
  textInput: {
    fontSize: 16,
  },
  iconWrapper: {
    height: 48,
    width: 48,
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: placeholderColor,
  },
})
