import React from 'react'
import { View } from 'react-native'

import { ThemedText } from 'Kebetoo/src/shared/components/text'
import { BASE_URL } from 'Kebetoo/src/shared/helpers/http'
import AudioPlayer from 'Kebetoo/src/shared/components/audio-player'
import { extractMetadataFromName } from 'Kebetoo/src/shared/hooks/audio-recorder'

import styles from './styles'

export const getSource = (url) => `${BASE_URL}${url}`

const AudioContent = ({
  content, audioName, audioUrl, style, onPress,
}) => (
  <View style={style}>
    <ThemedText style={styles.text} text={content} />
    <AudioPlayer
      onPress={onPress}
      source={getSource(audioUrl)}
      duration={parseInt(extractMetadataFromName(audioName).duration, 10)}
    />
  </View>
)

export default React.memo(AudioContent)
