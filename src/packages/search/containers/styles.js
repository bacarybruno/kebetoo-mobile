import { StyleSheet } from 'react-native'
import { human, systemWeights } from 'react-native-typography'

import colors from 'Kebetoo/src/theme/colors'
import { deleteProperty, mergeObjects } from 'Kebetoo/src/shared/helpers/object'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabbar: {
    backgroundColor: colors.background,
  },
  label: deleteProperty(mergeObjects(human.footnote, systemWeights.bold), 'color'),
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
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
