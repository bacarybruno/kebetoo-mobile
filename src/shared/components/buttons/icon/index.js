import { View, TouchableOpacity } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { useAppColors, useAppStyles } from '@app/shared/hooks';
import { Badge, Pressable, Typography } from '@app/shared/components';

import createThemedStyles from './styles';

const IconButton = ({
  onPress,
  text,
  style,
  iconName,
  ...rest
}) => {
  const styles = useAppStyles(createThemedStyles);
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} {...rest}>
      <Ionicon style={styles.icon} name={iconName} size={30} />
    </TouchableOpacity>
  );
};

const TextIconButton = ({
  icon, text, badge, onPress, children, badgeColor, ...otherProps
}) => {
  const styles = useAppStyles(createThemedStyles);
  const { colors } = useAppColors();
  return (
    <Pressable style={styles.iconButtonWrapper} onPress={onPress} {...otherProps}>
      <View style={styles.iconWrapper}>
        <Ionicon name={icon} size={25} style={styles.textIcon} color={colors.icon} />
      </View>
      <View style={styles.content}>
        <Typography
          type={Typography.types.headline5}
          text={text}
          numberOfLines={1}
          style={styles.title}
        />
        {badge && (
          <Badge
            primary
            text={badge}
            color={badgeColor}
            typography={Typography.types.caption}
            style={styles.badge}
          />
        )}
      </View>
    </Pressable>
  );
};

IconButton.Text = TextIconButton;

export default IconButton;
