import { StyleSheet } from 'react-native'

import metrics from 'Kebetoo/src/theme/metrics'

import { fontSizes } from 'Kebetoo/src/shared/components/text'

export const placeholderColor = '#ACACAC'

export default StyleSheet.create({
  wrapper: {
    backgroundColor: '#F2F2F2',
    minHeight: 48,
    borderColor: '#E8E8E8',
    borderRadius: 15,
    borderWidth: 1,
    paddingLeft: metrics.marginHorizontal,
  },
  textInput: {
    fontSize: fontSizes.md,
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
