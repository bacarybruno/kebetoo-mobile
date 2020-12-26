import { StyleSheet } from 'react-native'
import { systemWeights } from 'react-native-typography'

import { metrics } from '@app/theme'

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  textInputWrapper: {
    borderColor: 'transparent',
    backgroundColor: colors.backgroundSecondary,
    paddingLeft: 0,
    margin: 10,
    borderRadius: 8,
  },
  textInputStyle: {
    ...systemWeights.regular,
    fontSize: 18,
    flex: 1,
  },
  cancelIcon: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentedControl: {
    marginHorizontal: metrics.marginHorizontal,
  },
})
