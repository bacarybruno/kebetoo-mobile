import React, { useLayoutEffect, useState, useCallback } from 'react'
import {
  View, TouchableWithoutFeedback, Platform, Keyboard,
} from 'react-native'
import { TransitionPresets } from '@react-navigation/stack'
import { CommonActions } from '@react-navigation/native'
import Snackbar from 'react-native-snackbar'
import { getBottomSpace } from 'react-native-iphone-x-helper'

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
import useFilePicker from '@app/features/post/hooks/file-picker'
import routes from '@app/navigation/routes'
import {
  useAppColors, useAppStyles, useAudioRecorder, useKeyboard, useUser,
} from '@app/shared/hooks'
import iosColors from '@app/theme/ios-colors'
import { VideoMarker } from '@app/shared/components/camera-roll-picker'

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

export const PostTextMessage = ({
  onChange, text, maxNumberOfLines = 8, displayCounter,
}) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.postTextMessage}>
      <Typography
        style={styles.textCount}
        type={Typography.types.headline6}
        text={
          displayCounter
            ? strings.formatString(
              strings.create_post.characters,
              TEXT_MAX_LENGHT - text.length,
            )
            : strings.create_post.caption
        }
      />
      <TextInput
        autoFocus
        multiline
        placeholder={strings.create_post.placeholder}
        onValueChange={onChange}
        returnKeyType="done"
        textStyle={styles.textInput}
        wrapperStyle={styles.textInputWrapper}
        inputWrapperStyle={styles.inputWrapper}
        maxLength={TEXT_MAX_LENGHT}
        defaultValue={text}
        numberOfLines={Math.min(
          Math.floor(metrics.screenHeight / 75),
          maxNumberOfLines,
        )}
      />
    </View>
  )
}

const Button = ({ name, onPress }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <IconButton name={name} style={styles.iconButton} onPress={onPress} />
  )
}

const ImagePreviewer = ({ uri, onDelete, onPress }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.imagePreviewer}>
      <TouchableWithoutFeedback onPress={onPress}>
        <ImageViewer source={{ uri }} borderRadius={15} onDelete={onDelete} />
      </TouchableWithoutFeedback>
    </View>
  )
}

const VideoPreviewer = ({ uri, onDelete, onPress }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.imagePreviewer}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View>
          <ImageViewer source={{ uri }} borderRadius={15} onDelete={onDelete} />
          <VideoMarker style={{ position: 'absolute', left: 10, bottom: 5 }} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

// TODO: separate UI from logic to make unit tests easier
// or use redux-saga to handle post creation
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
  const filePicker = useFilePicker(['image', 'video'].includes(mediaType) ? params.sharedFile : undefined)
  const payload = (editMode ? params.payload.content : (params && params.sharedText)) || ''
  const [text, setText] = useState((value) => value || payload)
  const { keyboardHeight, keyboardShown } = useKeyboard()

  const onHeaderSavePress = useCallback(async () => {
    setIsLoading(true)
    try {
      let post = null
      const repost = params?.post ?? undefined
      if (editMode) {
        post = await api.posts.update({ id: params.payload.id, content: text })
      } else if (audioRecorder.hasRecording) {
        post = await audioRecorder.savePost(profile.uid, text, repost)
      } else if (filePicker.hasFile) {
        post = await filePicker.savePost(profile.uid, text, repost)
      } else {
        post = await api.posts.create({ content: text, repost, author: profile.uid })
      }

      const updatedPost = { ...post, localFileUri: filePicker.file.uri }
      setIsLoading(false)
      if (params && params.onGoBack) params.onGoBack(updatedPost)

      if (editMode) {
        Snackbar.show({
          text: strings.create_post.post_edited,
          duration: Snackbar.LENGTH_SHORT,
        })
        navigation.dispatch((state) => {
          // Remove the manage_page route from the stack
          const newRoutes = state.routes.filter((r) => r.name !== routes.MANAGE_POSTS)

          return CommonActions.reset({
            ...state,
            routes: newRoutes,
            index: newRoutes.length - 1,
          })
        })
        return navigation.replace(routes.MANAGE_POSTS, {
          payload: post.id,
          action: actionTypes.EDIT,
        })
      }

      Snackbar.show({
        text: strings.create_post.post_created,
        duration: Snackbar.LENGTH_LONG,
        action: {
          text: strings.create_post.show_post_created.toUpperCase(),
          textColor: iosColors.systemBlue.dark,
          onPress: () => {
            navigation.navigate(routes.COMMENTS, { post: updatedPost })
          },
        },
      })

      return navigation.goBack()
    } catch (error) {
      Snackbar.show({
        text: strings.errors.create_post_error,
        duration: Snackbar.LENGTH_LONG,
        action: {
          text: strings.errors.retry.toUpperCase(),
          textColor: iosColors.systemBlue.dark,
          onPress: () => onHeaderSavePress(),
        },
      })
      return setIsLoading(false)
    }
  }, [params, editMode, audioRecorder, filePicker, navigation, text, profile.uid])

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
  }, [text, navigation, onHeaderSavePress, getHeaderMessages, isLoading, styles])

  const openImagePreview = useCallback(() => {
    navigation.navigate(routes.MODAL_IMAGE, {
      source: {
        uri: filePicker.file.uri,
      },
    })
  }, [filePicker.file, navigation])

  const openVideoPreview = useCallback(() => {
    navigation.navigate(routes.MODAL_VIDEO, {
      source: filePicker.file.uri,
      poster: null,
    })
  }, [filePicker.file, navigation])

  const marginBottom = keyboardHeight - getBottomSpace() + metrics.marginHorizontal
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, Platform.OS === 'ios' && keyboardShown && { marginBottom }]}>
        <PostTextMessage onChange={setText} text={text} displayCounter={text.length > 0} />
        <View style={styles.preview}>
          {audioRecorder.hasRecording && (
            <AudioPlayer
              source={audioRecorder.recordUri}
              onDelete={audioRecorder.reset}
              duration={audioRecorder.elapsedTime}
              style={styles.audioPlayer}
            />
          )}
          {filePicker.hasFile && filePicker.type === 'image' && (
            <ImagePreviewer
              uri={filePicker.file.uri}
              onDelete={filePicker.reset}
              onPress={openImagePreview}
            />
          )}
          {filePicker.hasFile && filePicker.type === 'video' && (
            <VideoPreviewer
              uri={filePicker.file.uri}
              onDelete={filePicker.reset}
              onPress={openVideoPreview}
            />
          )}
        </View>
        {!editMode && !audioRecorder.hasRecording && !filePicker.hasFile && (
          <View style={styles.buttonsWrapper}>
            <View style={styles.buttonsContainer}>
              {!audioRecorder.isRecording && !shareMode && (
                <>
                  <Button name="camera" onPress={filePicker.pickVideo} />
                  <Button name="photo" onPress={filePicker.pickImage} />
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
    </TouchableWithoutFeedback>
  )
}

export default React.memo(CreatePostPage)
