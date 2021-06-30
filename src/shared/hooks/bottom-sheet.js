/* eslint-disable consistent-return */
import { useCallback } from 'react';
import { Keyboard } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { strings } from '@app/config';
import { rgbaToHex } from '@app/theme/colors';

import useAppColors from './app-colors';

const createBottomSheetIcon = (color) => (item) => (
  <Ionicon name={item.icon} size={24} color={color} />
);

const useBottomSheet = () => {
  const { showActionSheetWithOptions } = useActionSheet();
  const { colors } = useAppColors();

  const showActionSheet = useCallback((args) => {
    Keyboard.dismiss();
    return (
      new Promise((resolve) => {
        showActionSheetWithOptions({
          title: strings.general.actions,
          textStyle: { color: colors.textPrimary },
          titleTextStyle: { color: colors.textSecondary },
          containerStyle: { backgroundColor: rgbaToHex(colors.backgroundSecondary) },
          ...args,
        }, (index) => {
          resolve(index);
        });
      })
    );
  }, [colors, showActionSheetWithOptions]);

  const showFeedPostsOptions = useCallback((post) => {
    const bottomSheetItems = [{
      title: strings.home.hide_post,
      icon: 'eye-off-outline',
    }, {
      title: strings.home.report_post,
      icon: 'flag-outline',
    }, {
      title: strings.formatString(
        strings.home.block_author,
        post.author.displayName.split(' ')[0],
      ),
      icon: 'remove-circle-outline',
    }, {
      title: strings.general.cancel,
      icon: 'md-close',
    }];

    const destructiveButtonIndex = bottomSheetItems.length - 2;
    return showActionSheet({
      options: bottomSheetItems.map((item) => item.title),
      icons: bottomSheetItems.map((item, index) => {
        if (index === destructiveButtonIndex) {
          return createBottomSheetIcon(colors.danger)(item);
        }
        return createBottomSheetIcon(colors.textPrimary)(item);
      }),
      cancelButtonIndex: bottomSheetItems.length - 1,
      destructiveButtonIndex: bottomSheetItems.length - 2,
    });
  }, [colors.danger, colors.textPrimary, showActionSheet]);

  const showManagePostsOptions = useCallback(() => {
    const bottomSheetItems = [{
      title: strings.manage_posts.edit_post,
      icon: 'md-create',
    }, {
      title: strings.manage_posts.delete_post,
      icon: 'ios-trash',
    }, {
      title: strings.general.cancel,
      icon: 'md-close',
    }];

    const destructiveButtonIndex = bottomSheetItems.length - 2;
    return showActionSheet({
      options: bottomSheetItems.map((item) => item.title),
      icons: bottomSheetItems.map((item, index) => {
        if (index === destructiveButtonIndex) {
          return createBottomSheetIcon(colors.danger)(item);
        }
        return createBottomSheetIcon(colors.textPrimary)(item);
      }),
      cancelButtonIndex: bottomSheetItems.length - 1,
      destructiveButtonIndex,
    });
  }, [colors, showActionSheet]);

  const showSharePostOptions = useCallback(() => {
    const bottomSheetItems = [{
      title: strings.reactions.share_now,
      icon: 'git-compare-outline',
    }, {
      title: strings.reactions.write_post,
      icon: 'create-outline',
    }, {
      title: strings.general.cancel,
      icon: 'close-outline',
    }];

    return showActionSheet({
      options: bottomSheetItems.map((item) => item.title),
      icons: bottomSheetItems.map(createBottomSheetIcon(colors.textPrimary)),
      cancelButtonIndex: bottomSheetItems.length - 1,
      title: strings.general.share,
    });
  }, [colors.textPrimary, showActionSheet]);

  const showAppearanceOptions = useCallback(() => {
    const bottomSheetItems = [{
      title: strings.general.system_default,
    }, {
      title: strings.profile.dark,
    }, {
      title: strings.profile.light,
    }, {
      title: strings.general.cancel,
    }];

    return showActionSheet({
      options: bottomSheetItems.map((item) => item.title),
      cancelButtonIndex: bottomSheetItems.length - 1,
    });
  }, [showActionSheet]);

  const showAvatarOptions = useCallback(() => {
    const bottomSheetItems = [{
      title: strings.profile.edit_picture,
      icon: 'camera-outline',
    }, {
      title: strings.profile.delete_picture,
      icon: 'trash-outline',
    }, {
      title: strings.profile.view_picture,
      icon: 'eye-outline',
    }, {
      title: strings.general.cancel,
      icon: 'close-outline',
    }];

    return showActionSheet({
      options: bottomSheetItems.map((item) => item.title),
      icons: bottomSheetItems.map(createBottomSheetIcon(colors.textPrimary)),
      cancelButtonIndex: bottomSheetItems.length - 1,
    });
  }, [colors.textPrimary, showActionSheet]);

  return {
    showFeedPostsOptions,
    showManagePostsOptions,
    showSharePostOptions,
    showAppearanceOptions,
    showAvatarOptions,
  };
};

export default useBottomSheet;
