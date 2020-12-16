import React, { useLayoutEffect, useState, useCallback } from 'react'
import { View } from 'react-native'
import { TransitionPresets } from '@react-navigation/stack'
import { CommonActions } from '@react-navigation/native'

import {
  TextInput, Typography, HeaderBack, OutlinedButton, AudioPlayer,
} from '@app/shared/components'
import IconButton from '@app/features/post/components/icon-button'
import { ImageViewer } from '@app/features/post/components/image-content'
import { api } from '@app/shared/services'
import { readableSeconds } from '@app/shared/helpers/dates'
import { strings } from '@app/config'
import { getMediaType } from '@app/shared/helpers/file'
import { metrics } from '@app/theme'
import useImagePicker from '@app/features/post/hooks/image-picker'
import routes from '@app/navigation/routes'
import {
  useAppColors, useAppStyles, useAudioRecorder, useUser,
} from '@app/shared/hooks'

import createThemedStyles from './styles'

export const routeOptions = (styles, colors) => ({
  headerShown: true,
  headerBackImage: () => (
    <HeaderBack.Close tintColor={colors.textPrimary} />
  ),
  headerStyle: styles.header,
  headerTitleStyle: { color: colors.textPrimary },
  ...TransitionPresets.ModalSlideFromBottomIOS,
})

export const actionTypes = {
  EDIT: 'edit',
  CREATE: 'create',
  SHARE: 'share',
}

const TEXT_MAX_LENGHT = 180

const noop = () => { }

export const PostTextMessage = ({ onChange, text, maxNumberOfLines = 8 }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
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
        type={Typography.types.headline6}
        text={strings.formatString(
          strings.create_post.characters,
          TEXT_MAX_LENGHT - text.length,
        )}
      />
    </>
  )
}

const Button = ({ name, onPress }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <IconButton name={name} style={styles.iconButton} onPress={onPress} />
  )
}

const ImagePreviewer = ({ uri, onDelete }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.imagePreviewer}>
      <ImageViewer source={{ uri }} borderRadius={15} onDelete={onDelete} />
    </View>
  )
}

const CreatePostPage = ({ route, navigation }) => {
  const styles = useAppStyles(createThemedStyles)
  const colors = useAppColors()
  navigation.setOptions(routeOptions(styles, colors))

  const { profile } = useUser()

  const { params } = route
  const [isLoading, setIsLoading] = useState(false)
  const editMode = params && params.action === actionTypes.EDIT
  const shareMode = params && params.action === actionTypes.SHARE
  const mediaType = getMediaType(params && params.sharedFile)
  const audioRecorder = useAudioRecorder(mediaType === 'audio' ? params.sharedFile : undefined)
  const imagePicker = useImagePicker(mediaType === 'image' ? params.sharedFile : undefined)
  const payload = (editMode ? params.payload.content : (params && params.sharedText)) || ''
  const [text, setText] = useState((value) => value || payload)

  const onHeaderSavePress = useCallback(async () => {
    setIsLoading(true)
    let result = null
    const repost = params?.post ?? undefined
    if (editMode) {
      result = await api.posts.update({ id: params.payload.id, content: text })
    } else if (audioRecorder.hasRecording) {
      result = await audioRecorder.savePost(profile.uid, text, repost)
    } else if (imagePicker.hasFile) {
      result = await imagePicker.savePost(profile.uid, text, repost)
    } else {
      result = await api.posts.create({ content: text, repost, author: profile.uid })
    }
    setIsLoading(false)
    if (params && params.onGoBack) params.onGoBack(result)

    if (editMode) return navigation.goBack()

    navigation.dispatch((state) => {
      // Remove the manage route from the stack
      const newRoutes = state.routes.filter((r) => r.name !== routes.MANAGE_POSTS)

      return CommonActions.reset({
        ...state,
        routes: newRoutes,
        index: newRoutes.length - 1,
      })
    })

    return navigation.replace(routes.MANAGE_POSTS, { payload: result.id })
  }, [editMode, audioRecorder, imagePicker, params, navigation, text, profile.uid])

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
    navigation.setOptions({
      headerRight: () => (
        <OutlinedButton
          text={headerMessages.post.toUpperCase()}
          disabled={text.length === 0 || isLoading}
          onPress={onHeaderSavePress}
          style={styles.headerSaveButton}
          loading={isLoading}
        />
      ),
      title: headerMessages.title,
    })
  }, [text, navigation, onHeaderSavePress, getHeaderMessages, isLoading, styles.headerSaveButton])

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
