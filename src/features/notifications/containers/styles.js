import { StyleSheet } from 'react-native'

import { elevation, metrics } from '@app/theme'

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: metrics.marginVertical,
    flexGrow: 1,
  },
  pageTitle: {
    paddingHorizontal: metrics.marginHorizontal,
    marginBottom: metrics.marginVertical / 2,
  },
  section: {
    marginBottom: metrics.marginVertical * 1.2,
  },
  header: {
    backgroundColor: colors.background,
    ...elevation(0),
  },
})
