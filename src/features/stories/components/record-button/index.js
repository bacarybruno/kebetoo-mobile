
import { useEffect, useState } from 'react';
import { View, Animated, Pressable } from 'react-native';

import { useAppStyles } from '@app/shared/hooks';
import { edgeInsets, metrics } from '@app/theme';

import createThemedStyles from './styles';

const scale = (value = 1) => ({ transform: [{ scale: value }] });

const RecordButton = ({
  onRecord, onEndRecord, isRecording, isDisabled,
}) => {
  const styles = useAppStyles(createThemedStyles);

  const [animatedScale] = useState(new Animated.Value(1));

  useEffect(() => {
    if (isRecording) {
      Animated.spring(animatedScale, {
        toValue: 1.5,
        bounciness: 10,
        speed: 10,
        useNativeDriver: true,
      }).start();
    } else {
      animatedScale.setValue(1);
    }
  }, [animatedScale, isRecording]);

  return (
    <View style={styles.recordButtonWrapper}>
      <Pressable
        onPressIn={onRecord}
        onPressOut={onEndRecord}
        activeOpacity={1}
        disabled={isDisabled}
        pressRetentionOffset={
          edgeInsets.symmetric({
            vertical: metrics.screenHeight,
            horizontal: metrics.screenWidth,
          })
        }
      >
        <Animated.View style={[styles.recordButton, scale(animatedScale)]}>
          <View style={styles.recordButtonContent} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default RecordButton;
