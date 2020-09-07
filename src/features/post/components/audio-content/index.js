import React from 'react'
import { View } from 'react-native'

import Typography, { types } from '@app/shared/components/typography'
import { BASE_URL } from '@app/shared/helpers/http'
import AudioPlayer from '@app/shared/components/audio-player'
import { extractMetadataFromName } from '@app/shared/hooks/audio-recorder'

import styles from './styles'

export const getSource = (url) => `${BASE_URL}${url}`

const AudioContent = ({
  content, audioName, audioUrl, style, onPress, mode,
}) => (
  <View style={style}>
    <Typography type={types.body} text={content} style={styles.text} />
    <AudioPlayer
      onPress={onPress}
      source={getSource(audioUrl)}
      style={mode === 'comments' ? styles.comment : undefined}
      duration={parseInt(extractMetadataFromName(audioName).duration, 10)}
    />
  </View>
)

export default React.memo(AudioContent)
