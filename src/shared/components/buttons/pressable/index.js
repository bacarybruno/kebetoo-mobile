import { useAppColors } from '@app/shared/hooks';
import { memo } from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';

export const CustomPressable = ({ children, ...otherProps }) => (
  <TouchableOpacity {...otherProps}>{children}</TouchableOpacity>
);

CustomPressable.SelectableBackground = () => ({});
CustomPressable.SelectableBackgroundBorderless = () => ({});
CustomPressable.Ripple = () => ({});

export const getTouchableComponent = (platform) => (
  platform.select({
    web: CustomPressable,
    default: platform.Version <= 20 ? CustomPressable : TouchableNativeFeedback,
  })
);

const Pressable = ({
  children, style, borderless, foreground, platform = Platform, ...otherProps
}) => {
  const { colors } = useAppColors();
  const TouchableComponent = getTouchableComponent(platform);

  if (TouchableComponent === TouchableNativeFeedback) {
    const rippleBackground = TouchableNativeFeedback.Ripple(colors.ripple, borderless);
    return (
      <TouchableComponent {...otherProps} useForeground={foreground} background={rippleBackground}>
        <View style={style}>{children}</View>
      </TouchableComponent>
    );
  }

  return <TouchableComponent style={style} {...otherProps}>{children}</TouchableComponent>;
};

export default memo(Pressable);
