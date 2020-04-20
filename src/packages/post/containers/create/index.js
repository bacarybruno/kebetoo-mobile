import React, { useLayoutEffect, useState } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { TransitionPresets } from '@react-navigation/stack'

import Text from 'Kebetoo/src/shared/components/text'
import TextInput from 'Kebetoo/src/shared/components/inputs/text'
import HeaderBack from 'Kebetoo/src/packages/post/components/header-back'
import HeaderSave from 'Kebetoo/src/packages/post/components/header-save'
import IconButton from 'Kebetoo/src/packages/post/components/icon-button'

import styles from './styles'

export const routeOptions = {
  title: 'Create post',
  headerShown: true,
  headerBackImage: ({ tintColor }) => <HeaderBack tintColor={tintColor} />,
  headerTitleAlign: 'left',
  headerStyle: styles.header,
  ...TransitionPresets.ModalSlideFromBottomIOS,
}

const TEXT_MAX_LENGHT = 180

const CreatePostPage = () => {
  const { setOptions } = useNavigation()
  const [text, setText] = useState('')

  const onHeaderSavePress = () => {
    console.log('header save press')
  }

  useLayoutEffect(() => {
    setOptions({
      headerRight: () => <HeaderSave onPress={onHeaderSavePress} />,
    })
  })

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TextInput
          placeholder="What's on your mind ?"
          fieldName="text"
          onValueChange={setText}
          returnKeyType="done"
          multiline
          numberOfLines={8}
          textStyle={styles.textInput}
          wrapperStyle={styles.textInputWrapper}
          maxLength={TEXT_MAX_LENGHT}
          autoFocus
        />
        <Text style={styles.textCount} size="tiny">
          {TEXT_MAX_LENGHT - text.length} characters
        </Text>
        <View style={styles.buttonsContainer}>
          <IconButton name="ios-videocam" style={styles.iconButton} onPress={() => {}} />
          <IconButton name="ios-mic" style={styles.iconButton} onPress={() => {}} />
          <IconButton name="ios-camera" style={styles.iconButton} onPress={() => {}} />
          <IconButton name="ios-more" style={styles.iconButton} onPress={() => {}} />
        </View>
      </View>
    </View>
  )
}

export default CreatePostPage
