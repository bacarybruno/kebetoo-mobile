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
  headerSaveButton: {
    marginHorizontal: metrics.marginHorizontal,
  },
  textInput: {
    textAlignVertical: 'top',
  },
  textInputWrapper: {
    marginTop: 8,
    backgroundColor: colors.input,
    paddingRight: metrics.marginHorizontal,
  },
  textCount: {
    marginTop: 8,
  },
  buttonsWrapper: {
    flexDirection: 'row', 
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  iconButton: {
    marginRight: metrics.marginHorizontal,
  },
})
