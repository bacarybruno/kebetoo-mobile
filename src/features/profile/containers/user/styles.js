import { StyleSheet } from 'react-native'

import { metrics, elevation } from '@app/theme'
import { hexToRgba, rgbaToHex } from '@app/theme/colors'

const profileInfoSize = 140

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    // backgroundColor: colors.background,
  },
  headerTitle: {
    color: colors.textPrimary,
  },
  userInfos: {
    width: '100%',
    marginTop: metrics.spacing.xl,
    justifyContent: 'center',
    paddingHorizontal: metrics.marginHorizontal,
  },
  paddingHorizontal: {
    paddingHorizontal: metrics.marginHorizontal,
  },
  sectionHeader: {
    marginBottom: metrics.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listHeader: {
    marginBottom: metrics.marginVertical,
  },
  listHeaderImage: {
    paddingHorizontal: metrics.marginHorizontal,
    aspectRatio: metrics.aspectRatio.square,
  },
  profileInfos: {
    backgroundColor: hexToRgba(rgbaToHex(colors.backgroundSecondary), 0.95),
    ...elevation(3),
    borderRadius: metrics.radius.md,
    height: profileInfoSize,
    marginTop: -profileInfoSize / 2,
    marginHorizontal: metrics.marginHorizontal,
  },
  profileInfoSection: {
    height: '50%',
    justifyContent: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  stats: {
    width: '100%',
    marginTop: 0,
    height: '100%',
    ...elevation(0),
  },
})
