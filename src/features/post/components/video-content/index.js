import React from 'react'
import { View } from 'react-native'

import { VideoPlayer, Typography, Pressable } from '@app/shared/components'
import { extractMetadataFromName } from '@app/shared/hooks/audio-recorder'
import { env } from '@app/config'
import { useAppStyles } from '@app/shared/hooks'
import { getExtension, getFileName } from '@app/shared/helpers/file'

import createThemedStyles from './styles'

export const getSource = (url) => (
  url.startsWith('http')
    ? url
    : `${env.assetsBaseUrl}/${url.startsWith('/') ? url.substr(1) : url}`
)

const getThumbnail = (videoUrl, extension = 'png') => {
  const fileName = getFileName(videoUrl)
  const fileExtension = getExtension(videoUrl)
  return videoUrl
    .replace(fileName, `thumbnails/${fileName}`)
    .replace(`.${fileExtension}`, `.${extension}`)
}

const VideoContent = ({
  content, videoName, videoUrl, localFileUri, style, onPress,
}) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={style}>
      <Typography type={Typography.types.body} text={content} style={styles.text} />
      <Pressable onPress={onPress}>
        <VideoPlayer
          source={getSource(videoUrl)}
          duration={parseInt(extractMetadataFromName(videoName).duration, 10)}
          thumbnail={getThumbnail(videoUrl, 'png')}
          preview={getThumbnail(videoUrl, 'gif')}
          localSource={localFileUri}
        />
      </Pressable>
    </View>
  )
}

export default React.memo(VideoContent)