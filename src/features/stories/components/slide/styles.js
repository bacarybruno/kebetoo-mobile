import { PixelRatio, Platform, StyleSheet } from 'react-native';

import { metrics } from '@app/theme';

export const iconSize = Math.min(110 / PixelRatio.get(), 40);

const bottomOffset = Platform.select({
  ios: metrics.tabBarFullHeight,
  android: 0,
});

export default (colors) => StyleSheet.create({
  page: {
    width: metrics.screenWidth,
    height: metrics.screenHeight - metrics.tabBarHeight,
    aspectRatio: metrics.aspectRatio.vertical,
  },
  video: {
    zIndex: 1,
  },
  reactions: {
    position: 'absolute',
    bottom: metrics.spacing.xl,
    right: metrics.spacing.sm,
  },
  actionBar: {
    marginBottom: bottomOffset,
  },
  footer: {
    position: 'absolute',
    bottom: metrics.spacing.xl + metrics.spacing.md + bottomOffset,
    left: metrics.spacing.md,
    width: '70%',
    zIndex: 3,
  },
  controlsOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
    zIndex: 4,
  },
  progress: {
    height: 3,
    backgroundColor: colors.white,
    opacity: 0.8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,
  },
  darkOverlay: {
    backgroundColor: colors.black,
    opacity: 0.05,
    zIndex: 6,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  user: {
    height: 55,
    marginBottom: metrics.spacing.lg,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reaction: {
    marginBottom: metrics.spacing.md,
    alignItems: 'center',
  },
  text: {
    color: colors.textPrimary,
    textAlign: 'center',
  },
  icon: {
    shadowOpacity: 2,
    textShadowRadius: 1,
    textShadowOffset: { width: 1, height: 1 },
  },
  commentPanelHeader: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    height: 50,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  modalCloseIcon: {
    position: 'absolute',
    right: metrics.spacing.md,
  },
  storyAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: metrics.spacing.sm,
  },
  authorName: {
    marginLeft: metrics.spacing.sm,
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.4,
  },
});
