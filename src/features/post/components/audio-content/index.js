import { memo } from 'react';
import { View } from 'react-native';

import { AudioPlayer, Typography } from '@app/shared/components';
import { extractMetadataFromName } from '@app/shared/hooks/audio-recorder';
import { env } from '@app/config';
import { useAppStyles } from '@app/shared/hooks';

import createThemedStyles from './styles';

export const getSource = (url) => (
  url.startsWith('http')
    ? url
    : `${env.assetsBaseUrl}/${url.startsWith('/') ? url.substr(1) : url}`
);

const AudioContent = ({
  content, audioName, audioUrl, style, onPress, mode,
}) => {
  const styles = useAppStyles(createThemedStyles);
  return (
    <View style={style}>
      <Typography type={Typography.types.body} text={content} style={styles.text} />
      <AudioPlayer
        onPress={onPress}
        source={getSource(audioUrl)}
        style={mode === 'comments' ? styles.comment : undefined}
        duration={parseInt(extractMetadataFromName(audioName).duration, 10)}
      />
    </View>
  );
};

export default memo(AudioContent);
