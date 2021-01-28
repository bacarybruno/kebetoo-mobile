import { StyleSheet } from 'react-native'

import { metrics } from '@app/theme'

import defaultStyles from '../styles'

export default (colors) => StyleSheet.create({
  button: {
    ...defaultStyles(colors).button,
    width: 57,
    backgroundColor: colors.primary,
  },
  icon: {
    color: colors.white,
  },
  textIcon: {
    width: 30,
  },
  iconButtonWrapper: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginRight: metrics.spacing.md,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    marginLeft: metrics.spacing.md,
    paddingHorizontal: metrics.spacing.sm,
  },
  title: {
    flex: 1,
  },
})
