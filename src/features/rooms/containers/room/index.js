import React, {
  useCallback, useEffect, useState, useContext, useRef, forwardRef,
} from 'react'
import {
  InteractionManager, StatusBar, TouchableOpacity, View,
} from 'react-native'
import { GiftedChat, Bubble, SystemMessage } from 'react-native-gifted-chat'
import { useRoute } from '@react-navigation/native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Popover, { PopoverPlacement } from 'react-native-popover-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  AppHeader, AudioPlayer, Avatar, IconButton,
} from '@app/shared/components'
import {
  useAppColors, useAppStyles, useAudioRecorder, useUser,
} from '@app/shared/hooks'
import { SafeAreaContext } from '@app/shared/contexts'

import mdColors from '@app/theme/md-colors'
import { CommentInput } from '@app/features/comments/components/comment-input'
import { strings } from '@app/config'
import { edgeInsets, metrics } from '@app/theme'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { extractMetadataFromUrl } from '@app/shared/hooks/audio-recorder'
import { abbreviateNumber } from '@app/shared/helpers/strings'
import { actionTypes } from '@app/features/post/containers/create'
import routes from '@app/navigation/routes'

import createThemedStyles from './styles'
import useRooms from '../../hooks/rooms'

export const getSystemMessage = (currentMessage) => {
  const { user, text } = currentMessage
  const string = strings.room[text.toLowerCase()]
  const message = string ? strings.formatString(string, user.name) : text
  return message
}

export const RightIcon = forwardRef(((props, ref) => {
  const { colors } = useAppColors()
  return (
    <TouchableOpacity
      ref={ref}
      onPress={props.onPress}
      hitSlop={edgeInsets.all(15)}
    >
      <Ionicon name="ellipsis-vertical" size={24} color={colors.white} />
    </TouchableOpacity>
  )
}))

const HeaderMenu = ({ report, exit }) => {
  const styles = useAppStyles(createThemedStyles)
  const [isVisible, setIsVisible] = useState(false)
  const insets = useSafeAreaInsets()

  const open = useCallback(() => {
    setIsVisible(true)
  }, [])

  const close = useCallback(() => {
    setIsVisible(false)
  }, [])

  const reportRoom = useCallback(() => {
    report()
    close()
  }, [close, report])

  const exitRoom = useCallback(() => {
    exit()
    close()
  }, [close, exit])

  return (
    <Popover
      popoverStyle={styles.popover}
      onOpenComplete={open}
      onCloseComplete={close}
      onRequestClose={close}
      isVisible={isVisible}
      placement={PopoverPlacement.BOTTOM}
      from={<RightIcon onPress={open} />}
      arrowStyle={{ width: 0, height: 0 }}
      safeAreaInsets={insets}
      verticalOffset={metrics.spacing.sm - 43}
      // icon height - (header height / 2)
    >
      <View style={styles.headerMenu}>
        <IconButton.Text
          icon="flag"
          onPress={reportRoom}
          text={strings.room.report_room}
        />
        <IconButton.Text
          icon="remove-circle"
          onPress={exitRoom}
          text={strings.room.exit_room}
        />
      </View>
    </Popover>
  )
}

const RoomPage = ({ navigation }) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors, resetAppBars } = useAppColors()
  const { params } = useRoute()
  const { profile } = useUser()
  const {
    messages: roomMessages,
    createMessage,
    onlineCount,
    quitRoom,
  } = useRooms(params._id)
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
    const unsubscribeFocus = navigation.addListener('focus', () => {
      updateTopSafeAreaColor(themeColor)
      updateBottomSafeAreaColor(colors.backgroundSecondary)
      StatusBar.setBackgroundColor(themeColor)
      StatusBar.setBarStyle('light-content')
    })
    const unsubscribeBlur = navigation.addListener('blur', () => {
      resetStatusBars()
      resetAppBars()
    })

    return () => {
      unsubscribeFocus()
      unsubscribeBlur()
    }
  }, [navigation])

  useEffect(() => {
    setMessages(roomMessages)
  }, [roomMessages])

  const reportRoom = useCallback(() => {
    navigation.navigate(routes.CREATE_POST, {
      action: actionTypes.REPORT,
      sharedText: `[${params._id}]\n\n ${strings.room.report_room_message}`,
    })
  }, [navigation, params._id])

  const exitRoom = useCallback(() => {
    quitRoom()
    navigation.goBack()
  }, [navigation, quitRoom])

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
      await createMessage({ room: params._id, text: message, audio })
      setMessage('')
    } catch (error) {
      console.log(error)
    }
  }, [message, audioRecorder, createMessage, params._id])

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

  const renderInputToolbar = useCallback(() => (
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
    const navigateToUserProfile = () => (
      // eslint-disable-next-line no-underscore-dangle
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
  }, [profile.uid, styles])

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
        size={15}
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
        Right={() => <HeaderMenu report={reportRoom} exit={exitRoom} />}
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
