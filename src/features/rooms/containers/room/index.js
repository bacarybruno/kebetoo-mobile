import React, {
  useCallback, useEffect, useState, useContext, useRef,
} from 'react'
import {
  InteractionManager, StatusBar, TouchableOpacity, View,
} from 'react-native'
import { GiftedChat, Bubble, SystemMessage } from 'react-native-gifted-chat'
import { useRoute } from '@react-navigation/native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { AppHeader, AudioPlayer, Avatar } from '@app/shared/components'
import {
  useAppColors, useAppStyles, useAudioRecorder, useUser,
} from '@app/shared/hooks'
import { SafeAreaContext } from '@app/shared/contexts'


import mdColors from '@app/theme/md-colors'
import { CommentInput } from '@app/features/comments/components/comment-input'
import { strings } from '@app/config'
import { metrics } from '@app/theme'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { extractMetadataFromUrl } from '@app/shared/hooks/audio-recorder'
import { abbreviateNumber } from '@app/shared/helpers/strings'

import createThemedStyles from './styles'
import useRooms from '../../hooks/rooms'
import routes from '@app/navigation/routes'

export const getSystemMessage = (currentMessage) => {
  const { user, text } = currentMessage
  const string = strings.room[text.toLowerCase()]
  const message = string ? strings.formatString(string, user.name) : text
  return message
}

const RoomPage = ({ navigation }) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors, resetAppBars } = useAppColors()
  const { params } = useRoute()
  const { profile } = useUser()
  const { messages: roomMessages, createMessage, onlineCount } = useRooms(params.id)
  const themeColor = colors[params.theme]
  const [isReady, setIsReady] = useState(false)
  const [message, setMessage] = useState('')
  const messageInput = useRef()
  const audioRecorder = useAudioRecorder()
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState(roomMessages)
  const {
    updateTopSafeAreaColor,
    updateBottomSafeAreaColor,
    resetStatusBars,
  } = useContext(SafeAreaContext)

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setIsReady(true)
    })
  }, [])

  useEffect(() => {
    updateTopSafeAreaColor(themeColor)
    updateBottomSafeAreaColor(colors.backgroundSecondary)
    StatusBar.setBackgroundColor(themeColor)
    StatusBar.setBarStyle('light-content')
    return () => {
      resetStatusBars()
      resetAppBars()
    }
  }, [])

  useEffect(() => {
    setMessages(roomMessages)
  }, [roomMessages])

  const onSend = useCallback(async () => {
    try {
      if (!message && !audioRecorder.hasRecording) return
      setIsLoading(true)
      messageInput.current?.clear()
      let audio = null
      if (audioRecorder.hasRecording) {
        audio = await audioRecorder.saveAsset()
      }
      setIsLoading(false)
      await createMessage({ room: params.id, text: message, audio })
      setMessage('')
    } catch (error) {
      console.log(error)
    }
  }, [message, audioRecorder, createMessage, params.id])

  const renderBubble = useCallback((props) => (
    <Bubble
      {...props}
      textStyle={{
        left: { color: colors.textPrimary },
        right: { color: mdColors.textPrimary.dark },
      }}
      timeTextStyle={{
        left: { color: colors.textSecondary },
        right: { color: mdColors.textSecondary.dark },
      }}
      wrapperStyle={{
        left: {
          backgroundColor: colors.backgroundSecondary,
        },
      }}
    />
  ), [colors])

  const renderInputToolbar = useCallback((props) => (
    <>
      <CommentInput
        theme={themeColor}
        placeholder={strings.room.type_message}
        onChange={setMessage}
        onSend={onSend}
        inputRef={messageInput}
        audioRecorder={audioRecorder}
        value={message}
        isLoading={isLoading}
        disableEmojis
        disableAutofocus
        handleContentSizeChange={false}
        // reply={toReply}
        // onReplyClose={clearToReply}
      />
    </>
  ), [themeColor, onSend, audioRecorder, message, isLoading])

  const renderAvatar = useCallback((props) => {
    const { user } = props.currentMessage
    const navigateToUserProfile = () =>　(
      navigation.navigate(routes.USER_PROFILE, { userId: user._id })
    )
    return (
      <TouchableOpacity onPress={navigateToUserProfile}>
        <Avatar size={35} fontSize={20} text={user.name} src={user.avatar} />
      </TouchableOpacity>
    )
  }, [navigation])

  const renderMessageAudio = useCallback((props) => {
    const { audio, user } = props.currentMessage
    const metadata = extractMetadataFromUrl(audio)
    const isOwnMessage = user._id === profile.uid
    return (
      <View style={styles.audioWrapper}>
        <AudioPlayer
          duration={metadata.duration}
          source={audio}
          style={{ ...styles.audio, ...[isOwnMessage ? {} : styles.incomingAudio][0] }}
        />
      </View>
    )
  }, [styles.audio, styles.audioWrapper, profile.uid])

  const renderTicks = useCallback((currentMessage) => {
    // eslint-disable-next-line no-underscore-dangle
    if (currentMessage.user._id !== profile.uid) return null
    const { sent, pending, received } = currentMessage
    let icon
    if (pending) icon = 'time'
    if (sent) icon = 'checkmark'
    if (received) icon = 'checkmark-done'
    return (
      <Ionicon
        name={icon}
        size={18}
        color={colors.white}
        style={{ marginRight: metrics.spacing.xs }}
      />
    )
  }, [colors.white, profile.uid])

  const renderSystemMessage = useCallback((props) => (
    <SystemMessage
      {...props}
      textStyle={{ color: colors.textSecondary }}
      currentMessage={{
        ...props.currentMessage,
        text: getSystemMessage(props.currentMessage),
      }}
    />
  ), [colors.textSecondary])

  return (
    <View style={styles.wrapper}>
      <AppHeader
        headerBack
        title={params.name}
        text={strings.formatString(strings.room.online_count, abbreviateNumber(onlineCount))}
        showAvatar={false}
        style={[styles.content, { backgroundColor: themeColor }]}
        titleStyle={{ color: mdColors.textPrimary.dark }}
        textStyle={{ color: mdColors.textSecondary.dark }}
        iconColor={colors.white}
        Logo={<View style={styles.onlineDot} />}
      />
      {isReady && (
        <GiftedChat
          messages={messages}
          timeTextStyle={{ color: colors.textSecondary }}
          user={{
            _id: profile.uid,
            name: profile.displayName,
            avatar: profile.photoURL,
          }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderMessageAudio={renderMessageAudio}
          locale={strings.getLanguage()}
          bottomOffset={isIphoneX() ? metrics.spacing.lg : undefined}
          renderAvatar={renderAvatar}
          renderSystemMessage={renderSystemMessage}
          renderTicks={renderTicks}
          onLongPress={() => { }}
        />
      )}
    </View>
  )
}

export default RoomPage
