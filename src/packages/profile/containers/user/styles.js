import { StyleSheet } from 'react-native'

import colors from 'Kebetoo/src/theme/colors'
import metrics from 'Kebetoo/src/theme/metrics'

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
  },
  headerTitle: {
    color: colors.textPrimary,
  },
  userInfos: {
    width: '100%',
    marginTop: 30,
    justifyContent: 'center',
    paddingHorizontal: metrics.marginHorizontal,
  },
  separator: {
    borderColor: colors.backgroundSecondary,
    borderWidth: 2,
    marginTop: 30,
    marginBottom: 15,
  },
  paddingHorizontal: {
    paddingHorizontal: metrics.marginHorizontal,
  },
  sectionHeader: {
    marginBottom: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})
