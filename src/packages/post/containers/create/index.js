import React, { useLayoutEffect, useState, useCallback, memo } from 'react'
import { View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { TransitionPresets } from '@react-navigation/stack'
import auth from '@react-native-firebase/auth'

import Text from 'Kebetoo/src/shared/components/text'
import TextInput from 'Kebetoo/src/shared/components/inputs/text'
import HeaderBack from 'Kebetoo/src/shared/components/header-back'
import OutlinedButton from 'Kebetoo/src/shared/components/buttons/outlined'
import IconButton from 'Kebetoo/src/packages/post/components/icon-button'
import * as api from 'Kebetoo/src/shared/helpers/http'

import styles from './styles'

export const routeOptions = {
  title: 'Create post',
  headerShown: true,
  headerBackImage: ({ tintColor }) => (
    <HeaderBack.Close tintColor={tintColor} />
  ),
  headerTitleAlign: 'left',
  headerStyle: styles.header,
  ...TransitionPresets.ModalSlideFromBottomIOS,
}

export const actionTypes = {
  EDIT: 'edit',
  CREATE: 'create'
}

const TEXT_MAX_LENGHT = 180

const CreatePostPage = () => {
  const { setOptions, goBack } = useNavigation()
  const { params } = useRoute()
  const editMode = params && params.action === actionTypes.EDIT
  const [text, setText] = useState(
    editMode
      ? params.payload.content
      : ''
  )

  const onHeaderSavePress = useCallback(async () => {
    const user = auth().currentUser
    let result
    if (editMode) {
      result = await api.editPost({ id: params.payload.id, content: text })
    } else {
      result = await api.createPost({ author: user.uid, content: text })
    }
    if (params && params.onGoBack) params.onGoBack(result)
    goBack()
  }, [text, goBack, params])

  useLayoutEffect(() => {
    setOptions({
      headerRight: () => (
        <OutlinedButton
          text={editMode ? 'EDIT' : 'POST'}
          disabled={text.length === 0}
          onPress={onHeaderSavePress}
          style={styles.headerSaveButton}
        />
      ),
      title: editMode ? 'Edit post' : 'Create post'
    })
  }, [text, editMode])

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TextInput
          placeholder="What's on your mind ?"
          onValueChange={setText}
          returnKeyType="done"
          numberOfLines={8}
          textStyle={styles.textInput}
          wrapperStyle={styles.textInputWrapper}
          maxLength={TEXT_MAX_LENGHT}
          defaultValue={text}
          autoFocus
          multiline
        />
        <Text style={styles.textCount} size="tiny">
          {TEXT_MAX_LENGHT - text.length} characters
        </Text>
        {!editMode && (
          <View style={styles.buttonsContainer}>
            <IconButton name="camera" style={styles.iconButton} onPress={() => { }} />
            <IconButton name="microphone" style={styles.iconButton} onPress={() => { }} />
            <IconButton name="photo" style={styles.iconButton} onPress={() => { }} />
            <IconButton name="more-h" style={styles.iconButton} onPress={() => { }} />
          </View>
        )}
      </View>
    </View>
  )
}

export default memo(CreatePostPage)
