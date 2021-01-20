import React, { useLayoutEffect, useState, useCallback } from 'react'
import {
  View, TouchableWithoutFeedback, Platform, ScrollView, Keyboard,
} from 'react-native'
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
  useAnalytics,
  useAppColors,
  useAppStyles,
  useAudioRecorder,
  useKeyboard,
  useUser,
} from '@app/shared/hooks'
import iosColors from '@app/theme/ios-colors'
import { VideoMarker } from '@app/shared/components/camera-roll-picker'
import { warnNotImplemented } from '@app/shared/components/no-content'

import createThemedStyles from './styles'

export const routeOptions = (styles, colors) => ({
  headerShown: true,
  headerBackImage: () => (
    <HeaderBack.Close tintColor={colors.textPrimary} />
  ),
  headerStyle: styles.header,
  headerTitleStyle: { color: colors.textPrimary },
})

export const actionTypes = {
  EDIT: 'edit',
  CREATE: 'create',
  SHARE: 'share',
  REPORT: 'report',
}

const noop = () => { }

export const PostTextMessage = ({
  onChange,
  text,
  displayCounter,
  editable = true,
  maxNumberOfLines = 8,
  placeholder = strings.create_post.placeholder,
  maxLength = 180,
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
              maxLength - text.length,
            )
            : strings.create_post.caption
        }
      />
      <TextInput
        autoFocus
        multiline
        placeholder={placeholder}
        onValueChange={onChange}
        returnKeyType="default"
        textStyle={styles.textInput}
        wrapperStyle={styles.textInputWrapper}
        inputWrapperStyle={styles.inputWrapper}
        maxLength={maxLength}
        editable={editable}
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

export const ImagePreviewer = ({ uri, onDelete, onPress }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.imagePreviewer}>
      <TouchableWithoutFeedback onPress={onPress}>
        <ImageViewer source={{ uri }} borderRadius={metrics.radius.md} onDelete={onDelete} />
      </TouchableWithoutFeedback>
    </View>
  )
}

export const VideoPreviewer = ({ uri, onDelete, onPress }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.imagePreviewer}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View>
          <ImageViewer source={{ uri }} borderRadius={metrics.radius.md} onDelete={onDelete} />
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
  const { colors } = useAppColors()
  navigation.setOptions(routeOptions(styles, colors))

  const { profile } = useUser()
  const { reportError } = useAnalytics()

  const { params } = route
  const [isLoading, setIsLoading] = useState(false)
  const editMode = params && params.action === actionTypes.EDIT
  const shareMode = params && params.action === actionTypes.SHARE
  const reportMode = params && params.action === actionTypes.REPORT
  const mediaType = getMediaType(params && params.sharedFile)
  const audioRecorder = useAudioRecorder(mediaType === 'audio' ? params.sharedFile : undefined)
  const filePicker = useFilePicker(['image', 'video'].includes(mediaType) ? params.sharedFile : undefined)
  const payload = (editMode ? params.payload.content : (params && params.sharedText)) || ''
  const [text, setText] = useState((value) => value || payload)
  const { keyboardHeight, keyboardShown } = useKeyboard()

  const onHeaderSavePress = useCallback(async () => {
    setIsLoading(true)
    try {
      Keyboard.dismiss()
      let post = null
      const repost = params?.post ?? undefined
      if (editMode) {
        post = await api.posts.update({ id: params.payload.id, content: text })
      } else if (reportMode) {
        if (filePicker.hasFile) post = await filePicker.saveFeedback(profile.uid, text)
        else post = api.feedbacks.create({ content: text, author: profile.uid })
      } else if (audioRecorder.hasRecording) {
        post = await audioRecorder.savePost(profile.uid, text, repost)
      } else if (filePicker.hasFile) {
        post = await filePicker.savePost(profile.uid, text, repost)
      } else {
        post = await api.posts.create({ content: text, repost, author: profile.uid })
      }

      if (post.error) throw new Error(post.error)

      const updatedPost = { ...post }
      if (filePicker?.file?.uri) {
        updatedPost.localFileUri = filePicker.file?.uri
      }

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

      if (reportMode) {
        Snackbar.show({
          text: strings.create_post.feedback_sent,
          duration: Snackbar.LENGTH_LONG,
        })
        return navigation.goBack()
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
      reportError(error)
      Snackbar.show({
        text: reportMode ? strings.errors.generic : strings.errors.create_post_error,
        duration: Snackbar.LENGTH_LONG,
        action: {
          text: strings.errors.retry.toUpperCase(),
          textColor: iosColors.systemBlue.dark,
          onPress: () => onHeaderSavePress(),
        },
      })
      return setIsLoading(false)
    }
  }, [params, editMode, audioRecorder, filePicker, reportMode, navigation, text, profile.uid, reportError])

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
    if (reportMode) {
      return {
        post: strings.general.send,
        title: strings.general.support,
      }
    }
    return {
      post: strings.general.post,
      title: strings.create_post.create_post,
    }
  }, [editMode, shareMode, reportMode])

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
    <ScrollView contentContainerStyle={styles.wrapper} keyboardShouldPersistTaps="always">
      <View style={[styles.container, Platform.OS === 'ios' && keyboardShown && { marginBottom }]}>
        <PostTextMessage
          onChange={setText}
          text={text}
          editable={!isLoading}
          displayCounter={text.length > 0}
          placeholder={reportMode ? strings.create_post.report_mode_placeholder : undefined}
          maxLength={reportMode ? 1000 : undefined}
        />
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
              uri={filePicker.file.originalUri || filePicker.file.uri}
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
                  {!reportMode && <Button name="camera" onPress={filePicker.pickVideo} />}
                  <Button name="photo" onPress={filePicker.pickImage} />
                  {!reportMode && <Button name="more-h" onPress={warnNotImplemented} />}
                </>
              )}
            </View>
            {!reportMode && (
              <IconButton
                activable
                name="microphone"
                style={styles.iconButton}
                onPressIn={audioRecorder.start}
                onPressOut={audioRecorder.stop}
                isActive={audioRecorder.isRecording}
                text={readableSeconds(audioRecorder.elapsedTime)}
              />
            )}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default React.memo(CreatePostPage)
