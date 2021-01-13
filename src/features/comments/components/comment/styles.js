import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

export const bottomBarSize = 45

export default (colors) => StyleSheet.create({
  flexible: {
    flex: 1,
  },
  audio: {
    marginTop: metrics.spacing.xs,
    backgroundColor: colors.backgroundSecondary,
  },
  reactionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  reactionsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: metrics.spacing.sm,
    paddingHorizontal: metrics.spacing.sm,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  avatarWrapper: {
    marginRight: metrics.spacing.sm,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.spacing.xs,
  },
})
