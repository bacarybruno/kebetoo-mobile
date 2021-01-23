import { metrics } from '@app/theme'
import { StyleSheet } from 'react-native'
import Typography from '../typography'

export default (colors) => StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetings: {
    flex: 8,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loading: {
    marginLeft: metrics.spacing.sm,
  },
  icon: {
    width: Typography.fontSizes.header,
    height: Typography.fontSizes.header,
    marginLeft: metrics.spacing.xs,
  },
  headerMenu: {
    minWidth: 250,
    paddingVertical: metrics.spacing.xs,
    paddingHorizontal: metrics.marginHorizontal,
  },
  popover: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: metrics.radius.sm,
  },
})
