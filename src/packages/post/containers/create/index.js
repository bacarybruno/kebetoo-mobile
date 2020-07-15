import React, { useLayoutEffect, useState, useCallback } from 'react'
import { View } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { TransitionPresets } from '@react-navigation/stack'

import Typography, { types } from 'Kebetoo/src/shared/components/typography'
import TextInput from 'Kebetoo/src/shared/components/inputs/text'
import HeaderBack from 'Kebetoo/src/shared/components/header-back'
import OutlinedButton from 'Kebetoo/src/shared/components/buttons/outlined'
import IconButton from 'Kebetoo/src/packages/post/components/icon-button'
import AudioPlayer from 'Kebetoo/src/shared/components/audio-player'
import { ImageViewer } from 'Kebetoo/src/packages/post/components/image-content'
import * as api from 'Kebetoo/src/shared/helpers/http'
import { readableSeconds } from 'Kebetoo/src/shared/helpers/dates'
import strings from 'Kebetoo/src/config/strings'
import { getMediaType } from 'Kebetoo/src/shared/helpers/file'
import metrics from 'Kebetoo/src/theme/metrics'
import useAudioRecorder from 'Kebetoo/src/shared/hooks/audio-recorder'
import useImagePicker from 'Kebetoo/src/packages/post/hooks/image-picker'
import colors from 'Kebetoo/src/theme/colors'
import useUser from 'Kebetoo/src/shared/hooks/user'

import styles from './styles'

export const routeOptions = {
  headerShown: true,
  headerBackImage: () => (
    <HeaderBack.Close tintColor={colors.textPrimary} />
  ),
  headerStyle: styles.header,
  headerTitleStyle: { color: colors.textPrimary },
  ...TransitionPresets.ModalSlideFromBottomIOS,
}

export const actionTypes = {
  EDIT: 'edit',
  CREATE: 'create',
  SHARE: 'share',
}

const TEXT_MAX_LENGHT = 180

const noop = () => { }

export const PostTextMessage = ({ onChange, text, maxNumberOfLines = 8 }) => (
  <>
    <TextInput
      autoFocus
      multiline
      placeholder={strings.create_post.placeholder}
      onValueChange={onChange}
      returnKeyType="done"
      textStyle={styles.textInput}
      wrapperStyle={styles.textInputWrapper}
      maxLength={TEXT_MAX_LENGHT}
      defaultValue={text}
      numberOfLines={Math.min(
        Math.floor(metrics.screenHeight / 75),
        maxNumberOfLines,
      )}
    />
    <Typography
      style={styles.textCount}
      type={types.headline6}
      text={strings.formatString(
        strings.create_post.characters,
        TEXT_MAX_LENGHT - text.length,
      )}
    />
  </>
)

const Button = ({ name, onPress }) => (
  <IconButton name={name} style={styles.iconButton} onPress={onPress} />
)

const ImagePreviewer = ({ uri, onDelete }) => (
  <View style={{ width: '50%' }}>
    <ImageViewer source={{ uri }} borderRadius={15} onDelete={onDelete} />
  </View>
)

const CreatePostPage = ({ navigation }) => {
  const { setOptions, goBack } = navigation
  setOptions(routeOptions)

  const { profile } = useUser()

  const { params } = useRoute()
  const [editMode] = useState(params && params.action === actionTypes.EDIT)
  const [shareMode] = useState(params && params.action === actionTypes.SHARE)
  const [text, setText] = useState((value) => value || (
    editMode
      ? params.payload.content
      : (params && params.sharedText) || ''
  ))
  const mediaType = getMediaType(params && params.sharedFile)
  const audioRecorder = useAudioRecorder(mediaType === 'audio' ? params.sharedFile : undefined)
  const imagePicker = useImagePicker(mediaType === 'image' ? params.sharedFile : undefined)

  const onHeaderSavePress = useCallback(async () => {
    let result
    const repost = params && params.post ? params.post : undefined
    if (editMode) {
      result = await api.editPost({ id: params.payload.id, content: text })
    } else if (audioRecorder.hasRecording) {
      result = await audioRecorder.savePost(profile.uid, text, repost)
    } else if (imagePicker.hasFile) {
      result = await imagePicker.savePost(profile.uid, text, repost)
    } else {
      result = await api.createPost({ content: text, repost, author: profile.uid })
    }
    if (params && params.onGoBack) params.onGoBack(result)
    goBack()
  }, [editMode, audioRecorder, imagePicker, params, goBack, text, profile.uid])

  const getHeaderMessages = useCallback(() => {
    if (editMode) {
      return {
        post: strings.general.edit,
        title: strings.create_post.edit_post,
      }
    }
    if (shareMode) {
      return {
        post: strings.general.share,
        title: strings.create_post.share_post,
      }
    }
    return {
      post: strings.general.post,
      title: strings.create_post.create_post,
    }
  }, [editMode, shareMode])

  useLayoutEffect(() => {
    const headerMessages = getHeaderMessages()
    setOptions({
      headerRight: () => (
        <OutlinedButton
          text={headerMessages.post.toUpperCase()}
          disabled={text.length === 0}
          onPress={onHeaderSavePress}
          style={styles.headerSaveButton}
        />
      ),
      title: headerMessages.title,
    })
  }, [text, setOptions, onHeaderSavePress, getHeaderMessages])

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <PostTextMessage onChange={setText} text={text} />
        <View style={styles.preview}>
          {audioRecorder.hasRecording && (
            <AudioPlayer
              source={audioRecorder.recordUri}
              onDelete={audioRecorder.reset}
              duration={audioRecorder.elapsedTime}
              style={styles.audioPlayer}
            />
          )}
          {imagePicker.hasFile && (
            <ImagePreviewer uri={imagePicker.file.uri} onDelete={imagePicker.reset} />
          )}
        </View>
        {!editMode && !audioRecorder.hasRecording && !imagePicker.hasFile && (
          <View style={styles.buttonsWrapper}>
            <View style={styles.buttonsContainer}>
              {!audioRecorder.isRecording && !shareMode && (
                <>
                  <Button name="camera" onPress={noop} />
                  <Button name="photo" onPress={imagePicker.pickImage} />
                  <Button name="more-h" onPress={noop} />
                </>
              )}
            </View>
            <IconButton
              activable
              name="microphone"
              style={styles.iconButton}
              onPressIn={audioRecorder.start}
              onPressOut={audioRecorder.stop}
              isActive={audioRecorder.isRecording}
              text={readableSeconds(audioRecorder.elapsedTime)}
            />
          </View>
        )}
      </View>
    </View>
  )
}

export default React.memo(CreatePostPage)
