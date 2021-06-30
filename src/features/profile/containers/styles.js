import { StyleSheet } from 'react-native';

import { metrics, elevation } from '@app/theme';

export const imageSize = 90;

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  padding: {
    paddingHorizontal: metrics.marginHorizontal,
  },
  header: {
    width: '100%',
    marginTop: metrics.spacing.md,
    justifyContent: 'center',
  },
  summary: {
    flexDirection: 'row',
  },
  summaryText: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: metrics.spacing.md,
  },
  imageWrapper: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    ...elevation(3),
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: imageSize / 2,
    backgroundColor: 'white',
  },
  stats: {
    width: '99%',
    alignSelf: 'center',
    height: 68,
    marginTop: metrics.spacing.lg,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: metrics.radius.lg,
    flexDirection: 'row',
    ...elevation(1),
  },
  stat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: metrics.marginHorizontal / 2,
    paddingHorizontal: metrics.marginHorizontal,
  },
  iconButtonTitle: {
    marginBottom: metrics.spacing.xs / 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: metrics.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    marginRight: metrics.spacing.md,
  },
  section: {
    marginTop: metrics.spacing.lg,
  },
  sectionTitle: {
    marginBottom: metrics.spacing.sm,
    paddingHorizontal: metrics.marginHorizontal,
  },
  iconButtonWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollViewContent: {
    paddingBottom: metrics.marginVertical,
  },
});
