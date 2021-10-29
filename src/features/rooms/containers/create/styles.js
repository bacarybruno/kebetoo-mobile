import { StyleSheet } from 'react-native';
import { human } from 'react-native-typography';

import { metrics } from '@app/theme';

export default (colors) => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: metrics.marginHorizontal,
  },
  content: {
    flex: 1,
  },
  inputWrapper: {
    flex: 1,
    marginBottom: metrics.spacing.xl,
    maxWidth: 300,
    width: '90%',
    alignSelf: 'center',
  },
  saveButton: {
    marginBottom: metrics.marginVertical,
  },
  label: {
    marginTop: metrics.spacing.lg,
    marginBottom: metrics.spacing.md,
  },
  textInputWrapper: {
    flex: 1,
    borderColor: 'transparent',
    borderRadius: 0,
    backgroundColor: colors.background,
  },
  textInput: {
    ...human.headlineObject,
    color: colors.textPrimary,
    fontWeight: 'normal',
  },
  flatlistColumn: {
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.xxl * 1.5,
  },
  flatlistContent: {
    justifyContent: 'space-between',
  },
  roomName: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  colorPickerItem: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
