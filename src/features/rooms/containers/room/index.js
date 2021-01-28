import React, { useCallback, useEffect, useState, useContext, useRef } from 'react'
import { InteractionManager, StatusBar, View } from 'react-native'
import { GiftedChat, Bubble, Send, SystemMessage } from 'react-native-gifted-chat'
import { useRoute } from '@react-navigation/native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { AppHeader, AudioPlayer, Avatar } from '@app/shared/components'
import { useAppColors, useAppStyles, useAudioRecorder, useUser } from '@app/shared/hooks'
import { SafeAreaContext } from '@app/features/app/containers'

import createThemedStyles from './styles'
import useRooms from '../../hooks/rooms'
import mdColors from '@app/theme/md-colors'
import { CommentInput } from '@app/features/comments/components/comment-input'
import { strings } from '@app/config'
import { metrics } from '@app/theme'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { extractMetadataFromUrl } from '@app/shared/hooks/audio-recorder'
import { abbreviateNumber } from '@app/shared/helpers/strings'

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
  const { updateTopSafeAreaColor, updateBottomSafeAreaColor, resetStatusBars } = useContext(SafeAreaContext)

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setIsReady(true)
    })
  }, [])

  useEffect(() => {
    setMessages(roomMessages)
  }, [roomMessages])

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

  const onSend = useCallback(async () => {
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
  }, [message, audioRecorder])

  const renderBubble = useCallback((props) => {
    return (
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
          }
        }}
      />
    )
  }, [])

  const renderInputToolbar = useCallback((props) => {
    return (
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
        // reply={toReply}
        // onReplyClose={clearToReply}
        />
      </>
    )
  }, [message, onSend, messageInput, audioRecorder, isLoading])

  const renderSend = useCallback((props) => {
    return (
      <Send {...props} textStyle={{ color: themeColor }} />
    )
  }, [])

  const renderAvatar = useCallback((props) => {
    const { user } = props.currentMessage
    return <Avatar size={35} text={user.name} src={user.avatar} />
  }, [])

  const renderMessageAudio = useCallback((props) => {
    const { audio } = props.currentMessage
    const metadata = extractMetadataFromUrl(audio)
    return (
      <View style={styles.audioWrapper}>
        <AudioPlayer
          duration={metadata.duration}
          source={audio}
          style={styles.audio}
        />
      </View>
    )
  }, [])

  const renderTicks = useCallback((currentMessage) => {
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
  }, [])

  const renderSystemMessage = useCallback((props) => {
    return (
      <SystemMessage
        {...props}
        textStyle={{ color: colors.textSecondary }}
        currentMessage={{
          ...props.currentMessage,
          text: getSystemMessage(props.currentMessage),
        }}
      />
    )
  }, [])

  return (
    <View style={styles.wrapper}>
      <AppHeader
        title={params.name}
        text={strings.formatString(strings.room.online_count, abbreviateNumber(onlineCount))}
        showAvatar={false}
        headerBack
        style={[styles.content, { backgroundColor: themeColor }]}
        titleStyle={{ color: colors.white }}
        textStyle={{ color: colors.white }}
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
          renderSend={renderSend}
          bottomOffset={isIphoneX() ? metrics.spacing.lg : undefined}
          renderAvatar={renderAvatar}
          renderSystemMessage={renderSystemMessage}
          renderTicks={renderTicks}
        />
      )}
    </View>
  )
}

export default RoomPage
