import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: metrics.marginVertical,
  },
  container: {
    flex: 1,
    marginHorizontal: metrics.marginHorizontal,
  },
  header: {
    backgroundColor: colors.white,
    elevation: 0,
  },
  textInput: {
    textAlignVertical: 'top',
  },
  textInputWrapper: {
    marginTop: 8,
    backgroundColor: colors.background_darker,
  },
  textCount: {
    marginTop: 8,
  },
  buttonsContainer: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  iconButton: {
    marginRight: metrics.marginHorizontal,
  },
})
