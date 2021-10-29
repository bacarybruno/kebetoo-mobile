import { StyleSheet } from 'react-native';

export default (colors) => StyleSheet.create({
  frontCameraFlash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.white,
    opacity: 0.8,
    zIndex: 1,
  },
});
