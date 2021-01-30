import React, { useEffect, useCallback, useState } from 'react'
import { View, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs'

import { strings } from '@app/config'
import { useUser, useNotifications, useAppStyles } from '@app/shared/hooks'
import { NOTIFICATION_STATUS } from '@app/shared/hooks/notifications'
import routes from '@app/navigation/routes'
import { api } from '@app/shared/services'
import { AppHeader, NoContent } from '@app/shared/components'

import Notification from '../components/notification'
import Heading from '../components/heading'
import createThemedStyles from './styles'

const routeOptions = { title: strings.tabs.notifications }

export const NOTIFICATION_TYPES = {
  COMMENT: 'comment',
  REPLY: 'reply',
  POST_REACTION: 'post-reaction',
  COMMENT_REACTION: 'comment-reaction',
  SYSTEM: 'system',
}

export const getNotificationTitle = (message) => {
  try {
    const payload = JSON.parse(message.data.payload)
    const name = payload.author.displayName
    switch (message.data.type) {
      case NOTIFICATION_TYPES.COMMENT:
        return { name, message: strings.notifications.commented_post }
      case NOTIFICATION_TYPES.COMMENT_REACTION:
        return { name, message: strings.notifications.reacted_comment }
      case NOTIFICATION_TYPES.POST_REACTION:
        return { name, message: strings.notifications.reacted_post }
      case NOTIFICATION_TYPES.REPLY:
        return { name, message: strings.notifications.replied_comment }
      case NOTIFICATION_TYPES.SYSTEM:
        return { name, message: payload.systemMessage }
      default:
        return null
    }
  } catch (error) {
    return null
  }
}

export const getNotificationMessage = (message) => {
  try {
    const payload = JSON.parse(message.data.payload)
    switch (message.data.type) {
      case NOTIFICATION_TYPES.COMMENT:
      case NOTIFICATION_TYPES.REPLY:
        return payload.content
      case NOTIFICATION_TYPES.COMMENT_REACTION:
        return payload.comment.content
      case NOTIFICATION_TYPES.POST_REACTION:
        return payload.post.content
      case NOTIFICATION_TYPES.SYSTEM:
        return payload.content
      default:
        return null
    }
  } catch (error) {
    return null
  }
}

const Section = ({ title, items, renderItem }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    items.length > 0 && (
      <View style={styles.section}>
        <Heading name={title} value={items.length} />
        {items.map(renderItem)}
      </View>
    )
  )
}

const NotificationsPage = () => {
  const {
    newItems, seenItems, isEmpty, updateSeenStatus, updateOpenStatus,
  } = useNotifications()
  const { addListener, navigate } = useNavigation()
  const { profile } = useUser()

  const [isLoading, setIsLoading] = useState(false)
  const styles = useAppStyles(createThemedStyles)

  useEffect(() => {
    const removeBlurListener = addListener('blur', () => {
      updateSeenStatus()
    })
    return () => {
      if (removeBlurListener) removeBlurListener()
    }
  }, [addListener, newItems, updateSeenStatus])

  const getAuthor = (message) => {
    try {
      const payload = JSON.parse(message.data.payload)
      return payload.author 
    } catch (error) {
      return {}
    }
  }

  const onNotificationOpen = useCallback(async ({ id, message }) => {
    setIsLoading(true)

    const payload = JSON.parse(message.data.payload)
    let postId = null

    switch (message.data.type) {
      case NOTIFICATION_TYPES.COMMENT:
      case NOTIFICATION_TYPES.POST_REACTION:
        postId = payload.post.id
        break
      case NOTIFICATION_TYPES.COMMENT_REACTION:
        postId = payload.comment.post
        break
      case NOTIFICATION_TYPES.REPLY:
        postId = payload.thread.post
        break
      case NOTIFICATION_TYPES.SYSTEM:
        postId = payload.post
      default:
        break
    }

    if (postId) {
      const post = await api.posts.getById(postId)
      navigate(routes.COMMENTS, { post })
    }

    updateOpenStatus(id)
    setIsLoading(false)
  }, [navigate, updateOpenStatus])

  const renderNotification = useCallback((item, index) => (
    <Notification
      isOpened={item.status === NOTIFICATION_STATUS.OPENED}
      onPress={() => onNotificationOpen(item)}
      title={getNotificationTitle(item.message)}
      message={getNotificationMessage(item.message)}
      author={getAuthor(item.message)}
      caption={dayjs(item.time).fromNow()}
      key={`${item.id}-${index}`}
    />
  ), [onNotificationOpen])

  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={styles.content}>
      <AppHeader
        title={strings.tabs.notifications}
        text=""
        displayName={profile.displayName}
        imageSrc={profile.photoURL}
        style={styles.pageTitle}
        loading={isLoading}
      />
      <Section
        title={strings.notifications.recent}
        items={newItems}
        renderItem={renderNotification}
      />
      <Section
        title={strings.notifications.already_seen}
        items={seenItems}
        renderItem={renderNotification}
      />
      {isEmpty && (
        <View style={styles.wrapper}>
          <NoContent text={strings.notifications.no_content} title={strings.general.no_content} />
        </View>
      )}
    </ScrollView>
  )
}

NotificationsPage.routeOptions = routeOptions

export default NotificationsPage
