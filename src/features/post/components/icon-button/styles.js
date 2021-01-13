import { StyleSheet } from 'react-native'

import { elevation, metrics } from '@app/theme'

export const getDimensions = (size) => ({
  width: size,
  height: size,
  borderRadius: metrics.radius.round,
})

export const getIconSize = (size) => size / 2.22

export default (colors) => StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    ...elevation(10),
  },
  badge: {
    marginRight: metrics.spacing.lg,
  },
})
